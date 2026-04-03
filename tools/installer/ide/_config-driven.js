const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('../prompts');
const csv = require('csv-parse/sync');
const { RMB_AID_FOLDER_NAME } = require('./shared/path-utils');

/**
 * Config-driven IDE setup handler
 *
 * This class provides a standardized way to install RMB_AID artifacts to IDEs
 * based on configuration in platform-codes.yaml. It eliminates the need for
 * individual installer files for each IDE.
 *
 * Features:
 * - Config-driven from platform-codes.yaml
 * - Verbatim skill installation from skill-manifest.csv
 * - Legacy directory cleanup and IDE-specific marker removal
 */
class ConfigDrivenIdeSetup {
  constructor(platformCode, platformConfig) {
    this.name = platformCode;
    this.displayName = platformConfig.name || platformCode;
    this.preferred = platformConfig.preferred || false;
    this.platformConfig = platformConfig;
    this.installerConfig = platformConfig.installer || null;
    this.rmbaidFolderName = RMB_AID_FOLDER_NAME;

    // Set configDir from target_dir so detect() works
    this.configDir = this.installerConfig?.target_dir || null;
  }

  setRmbaidFolderName(rmbaidFolderName) {
    this.rmbaidFolderName = rmbaidFolderName;
  }

  /**
   * Detect whether this IDE already has configuration in the project.
   * Checks for rmbaid-prefixed entries in target_dir.
   * @param {string} projectDir - Project directory
   * @returns {Promise<boolean>}
   */
  async detect(projectDir) {
    if (!this.configDir) return false;

    const dir = path.join(projectDir || process.cwd(), this.configDir);
    if (await fs.pathExists(dir)) {
      try {
        const entries = await fs.readdir(dir);
        return entries.some((e) => typeof e === 'string' && e.startsWith('rmbaid'));
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Main setup method - called by IdeManager
   * @param {string} projectDir - Project directory
   * @param {string} rmbaidDir - RMB_AID installation directory
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Setup result
   */
  async setup(projectDir, rmbaidDir, options = {}) {
    // Check for RMB_AID files in ancestor directories that would cause duplicates
    if (this.installerConfig?.ancestor_conflict_check) {
      const conflict = await this.findAncestorConflict(projectDir);
      if (conflict) {
        await prompts.log.error(
          `Found existing RMB_AID skills in ancestor installation: ${conflict}\n` +
            `  ${this.name} inherits skills from parent directories, so this would cause duplicates.\n` +
            `  Please remove the RMB_AID files from that directory first:\n` +
            `    rm -rf "${conflict}"/rmbaid*`,
        );
        return {
          success: false,
          reason: 'ancestor-conflict',
          error: `Ancestor conflict: ${conflict}`,
          conflictDir: conflict,
        };
      }
    }

    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Clean up any old RMB_AID installation first
    await this.cleanup(projectDir, options);

    if (!this.installerConfig) {
      return { success: false, reason: 'no-config' };
    }

    if (this.installerConfig.target_dir) {
      return this.installToTarget(projectDir, rmbaidDir, this.installerConfig, options);
    }

    return { success: false, reason: 'invalid-config' };
  }

  /**
   * Install to a single target directory
   * @param {string} projectDir - Project directory
   * @param {string} rmbaidDir - RMB_AID installation directory
   * @param {Object} config - Installation configuration
   * @param {Object} options - Setup options
   * @returns {Promise<Object>} Installation result
   */
  async installToTarget(projectDir, rmbaidDir, config, options) {
    const { target_dir } = config;
    const targetPath = path.join(projectDir, target_dir);
    await fs.ensureDir(targetPath);

    this.skillWriteTracker = new Set();
    const results = { skills: 0 };

    results.skills = await this.installVerbatimSkills(projectDir, rmbaidDir, targetPath, config);
    results.skillDirectories = this.skillWriteTracker.size;

    await this.printSummary(results, target_dir, options);
    this.skillWriteTracker = null;
    return { success: true, results };
  }

  /**
   * Install verbatim native SKILL.md directories from skill-manifest.csv.
   * Copies the entire source directory as-is into the IDE skill directory.
   * The source SKILL.md is used directly — no frontmatter transformation or file generation.
   * @param {string} projectDir - Project directory
   * @param {string} rmbaidDir - RMB_AID installation directory
   * @param {string} targetPath - Target skills directory
   * @param {Object} config - Installation configuration
   * @returns {Promise<number>} Count of skills installed
   */
  async installVerbatimSkills(projectDir, rmbaidDir, targetPath, config) {
    const rmbaidFolderName = path.basename(rmbaidDir);
    const rmbaidPrefix = rmbaidFolderName + '/';
    const csvPath = path.join(rmbaidDir, '_config', 'skill-manifest.csv');

    if (!(await fs.pathExists(csvPath))) return 0;

    const csvContent = await fs.readFile(csvPath, 'utf8');
    const records = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    let count = 0;

    for (const record of records) {
      const canonicalId = record.canonicalId;
      if (!canonicalId) continue;

      // Derive source directory from path column
      // path is like "_rmbaid/rmbaid/workflows/rmbaid-quick-flow/rmbaid-quick-dev-new-preview/SKILL.md"
      // Strip rmbaidFolderName prefix and join with rmbaidDir, then get dirname
      const relativePath = record.path.startsWith(rmbaidPrefix) ? record.path.slice(rmbaidPrefix.length) : record.path;
      const sourceFile = path.join(rmbaidDir, relativePath);
      const sourceDir = path.dirname(sourceFile);

      if (!(await fs.pathExists(sourceDir))) continue;

      // Clean target before copy to prevent stale files
      const skillDir = path.join(targetPath, canonicalId);
      await fs.remove(skillDir);
      await fs.ensureDir(skillDir);
      this.skillWriteTracker?.add(canonicalId);

      // Copy all skill files, filtering OS/editor artifacts recursively
      const skipPatterns = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
      const skipSuffixes = ['~', '.swp', '.swo', '.bak'];
      const filter = (src) => {
        const name = path.basename(src);
        if (src === sourceDir) return true;
        if (skipPatterns.has(name)) return false;
        if (name.startsWith('.') && name !== '.gitkeep') return false;
        if (skipSuffixes.some((s) => name.endsWith(s))) return false;
        return true;
      };
      await fs.copy(sourceDir, skillDir, { filter });

      count++;
    }

    // Post-install cleanup: remove _rmbaid/ directories for skills with install_to_rmbaid === "false"
    for (const record of records) {
      if (record.install_to_rmbaid === 'false') {
        const relativePath = record.path.startsWith(rmbaidPrefix) ? record.path.slice(rmbaidPrefix.length) : record.path;
        const sourceFile = path.join(rmbaidDir, relativePath);
        const sourceDir = path.dirname(sourceFile);
        if (await fs.pathExists(sourceDir)) {
          await fs.remove(sourceDir);
        }
      }
    }

    return count;
  }

  /**
   * Print installation summary
   * @param {Object} results - Installation results
   * @param {string} targetDir - Target directory (relative)
   */
  async printSummary(results, targetDir, options = {}) {
    if (options.silent) return;
    const count = results.skillDirectories || results.skills || 0;
    if (count > 0) {
      await prompts.log.success(`${this.name} configured: ${count} skills → ${targetDir}`);
    }
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir, options = {}) {
    // Migrate legacy target directories (e.g. .opencode/agent → .opencode/agents)
    if (this.installerConfig?.legacy_targets) {
      if (!options.silent) await prompts.log.message('  Migrating legacy directories...');
      for (const legacyDir of this.installerConfig.legacy_targets) {
        if (this.isGlobalPath(legacyDir)) {
          await this.warnGlobalLegacy(legacyDir, options);
        } else {
          await this.cleanupTarget(projectDir, legacyDir, options);
          await this.removeEmptyParents(projectDir, legacyDir);
        }
      }
    }

    // Strip RMB_AID markers from copilot-instructions.md if present
    if (this.name === 'github-copilot') {
      await this.cleanupCopilotInstructions(projectDir, options);
    }

    // Strip RMB_AID modes from .kilocodemodes if present
    if (this.name === 'kilo') {
      await this.cleanupKiloModes(projectDir, options);
    }

    // Strip RMB_AID entries from .rovodev/prompts.yml if present
    if (this.name === 'rovo-dev') {
      await this.cleanupRovoDevPrompts(projectDir, options);
    }

    // Clean target directory
    if (this.installerConfig?.target_dir) {
      await this.cleanupTarget(projectDir, this.installerConfig.target_dir, options);
    }
  }

  /**
   * Check if a path is global (starts with ~ or is absolute)
   * @param {string} p - Path to check
   * @returns {boolean}
   */
  isGlobalPath(p) {
    return p.startsWith('~') || path.isAbsolute(p);
  }

  /**
   * Warn about stale RMB_AID files in a global legacy directory (never auto-deletes)
   * @param {string} legacyDir - Legacy directory path (may start with ~)
   * @param {Object} options - Options (silent, etc.)
   */
  async warnGlobalLegacy(legacyDir, options = {}) {
    try {
      const expanded = legacyDir.startsWith('~/')
        ? path.join(os.homedir(), legacyDir.slice(2))
        : legacyDir === '~'
          ? os.homedir()
          : legacyDir;

      if (!(await fs.pathExists(expanded))) return;

      const entries = await fs.readdir(expanded);
      const rmbaidFiles = entries.filter((e) => typeof e === 'string' && e.startsWith('rmbaid'));

      if (rmbaidFiles.length > 0 && !options.silent) {
        await prompts.log.warn(`Found ${rmbaidFiles.length} stale RMB_AID file(s) in ${expanded}. Remove manually: rm ${expanded}/rmbaid-*`);
      }
    } catch {
      // Errors reading global paths are silently ignored
    }
  }

  /**
   * Cleanup a specific target directory
   * @param {string} projectDir - Project directory
   * @param {string} targetDir - Target directory to clean
   */
  async cleanupTarget(projectDir, targetDir, options = {}) {
    const targetPath = path.join(projectDir, targetDir);

    if (!(await fs.pathExists(targetPath))) {
      return;
    }

    // Remove all rmbaid* files
    let entries;
    try {
      entries = await fs.readdir(targetPath);
    } catch {
      // Directory exists but can't be read - skip cleanup
      return;
    }

    if (!entries || !Array.isArray(entries)) {
      return;
    }

    let removedCount = 0;

    for (const entry of entries) {
      if (!entry || typeof entry !== 'string') {
        continue;
      }
      if (entry.startsWith('rmbaid') && !entry.startsWith('rmbaid-os-')) {
        const entryPath = path.join(targetPath, entry);
        try {
          await fs.remove(entryPath);
          removedCount++;
        } catch {
          // Skip entries that can't be removed (broken symlinks, permission errors)
        }
      }
    }

    if (removedCount > 0 && !options.silent) {
      await prompts.log.message(`  Cleaned ${removedCount} RMB_AID files from ${targetDir}`);
    }

    // Remove empty directory after cleanup
    if (removedCount > 0) {
      try {
        const remaining = await fs.readdir(targetPath);
        if (remaining.length === 0) {
          await fs.remove(targetPath);
        }
      } catch {
        // Directory may already be gone or in use — skip
      }
    }
  }

  /**
   * Strip RMB_AID-owned content from .github/copilot-instructions.md.
   * The old custom installer injected content between <!-- RMB_AID:START --> and <!-- RMB_AID:END --> markers.
   * Deletes the file if nothing remains. Restores .bak backup if one exists.
   */
  async cleanupCopilotInstructions(projectDir, options = {}) {
    const filePath = path.join(projectDir, '.github', 'copilot-instructions.md');

    if (!(await fs.pathExists(filePath))) return;

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const startIdx = content.indexOf('<!-- RMB_AID:START -->');
      const endIdx = content.indexOf('<!-- RMB_AID:END -->');

      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return;

      const cleaned = content.slice(0, startIdx) + content.slice(endIdx + '<!-- RMB_AID:END -->'.length);

      if (cleaned.trim().length === 0) {
        await fs.remove(filePath);
        const backupPath = `${filePath}.bak`;
        if (await fs.pathExists(backupPath)) {
          await fs.rename(backupPath, filePath);
          if (!options.silent) await prompts.log.message('  Restored copilot-instructions.md from backup');
        }
      } else {
        await fs.writeFile(filePath, cleaned, 'utf8');
        const backupPath = `${filePath}.bak`;
        if (await fs.pathExists(backupPath)) await fs.remove(backupPath);
      }

      if (!options.silent) await prompts.log.message('  Cleaned RMB_AID markers from copilot-instructions.md');
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not clean RMB_AID markers from copilot-instructions.md');
    }
  }

  /**
   * Strip RMB_AID-owned modes from .kilocodemodes.
   * The old custom kilo.js installer added modes with slug starting with 'rmbaid-'.
   * Parses YAML, filters out RMB_AID modes, rewrites. Leaves file as-is on parse failure.
   */
  async cleanupKiloModes(projectDir, options = {}) {
    const kiloModesPath = path.join(projectDir, '.kilocodemodes');

    if (!(await fs.pathExists(kiloModesPath))) return;

    const content = await fs.readFile(kiloModesPath, 'utf8');

    let config;
    try {
      config = yaml.parse(content) || {};
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not parse .kilocodemodes for cleanup');
      return;
    }

    if (!Array.isArray(config.customModes)) return;

    const originalCount = config.customModes.length;
    config.customModes = config.customModes.filter((mode) => mode && (!mode.slug || !mode.slug.startsWith('rmbaid-')));
    const removedCount = originalCount - config.customModes.length;

    if (removedCount > 0) {
      try {
        await fs.writeFile(kiloModesPath, yaml.stringify(config, { lineWidth: 0 }));
        if (!options.silent) await prompts.log.message(`  Removed ${removedCount} RMB_AID modes from .kilocodemodes`);
      } catch {
        if (!options.silent) await prompts.log.warn('  Warning: Could not write .kilocodemodes during cleanup');
      }
    }
  }

  /**
   * Strip RMB_AID-owned entries from .rovodev/prompts.yml.
   * The old custom rovodev.js installer registered workflows in prompts.yml.
   * Parses YAML, filters out entries with name starting with 'rmbaid-', rewrites.
   * Removes the file if no entries remain.
   */
  async cleanupRovoDevPrompts(projectDir, options = {}) {
    const promptsPath = path.join(projectDir, '.rovodev', 'prompts.yml');

    if (!(await fs.pathExists(promptsPath))) return;

    const content = await fs.readFile(promptsPath, 'utf8');

    let config;
    try {
      config = yaml.parse(content) || {};
    } catch {
      if (!options.silent) await prompts.log.warn('  Warning: Could not parse prompts.yml for cleanup');
      return;
    }

    if (!Array.isArray(config.prompts)) return;

    const originalCount = config.prompts.length;
    config.prompts = config.prompts.filter((entry) => entry && (!entry.name || !entry.name.startsWith('rmbaid-')));
    const removedCount = originalCount - config.prompts.length;

    if (removedCount > 0) {
      try {
        if (config.prompts.length === 0) {
          await fs.remove(promptsPath);
        } else {
          await fs.writeFile(promptsPath, yaml.stringify(config, { lineWidth: 0 }));
        }
        if (!options.silent) await prompts.log.message(`  Removed ${removedCount} RMB_AID entries from prompts.yml`);
      } catch {
        if (!options.silent) await prompts.log.warn('  Warning: Could not write prompts.yml during cleanup');
      }
    }
  }

  /**
   * Check ancestor directories for existing RMB_AID files in the same target_dir.
   * IDEs like Claude Code inherit commands from parent directories, so an existing
   * installation in an ancestor would cause duplicate commands.
   * @param {string} projectDir - Project directory being installed to
   * @returns {Promise<string|null>} Path to conflicting directory, or null if clean
   */
  async findAncestorConflict(projectDir) {
    const targetDir = this.installerConfig?.target_dir;
    if (!targetDir) return null;

    const resolvedProject = await fs.realpath(path.resolve(projectDir));
    let current = path.dirname(resolvedProject);
    const root = path.parse(current).root;

    while (current !== root && current.length > root.length) {
      const candidatePath = path.join(current, targetDir);
      try {
        if (await fs.pathExists(candidatePath)) {
          const entries = await fs.readdir(candidatePath);
          const hasRmbaid = entries.some(
            (e) => typeof e === 'string' && e.toLowerCase().startsWith('rmbaid') && !e.toLowerCase().startsWith('rmbaid-os-'),
          );
          if (hasRmbaid) {
            return candidatePath;
          }
        }
      } catch {
        // Can't read directory — skip
      }
      current = path.dirname(current);
    }

    return null;
  }

  /**
   * Walk up ancestor directories from relativeDir toward projectDir, removing each if empty
   * Stops at projectDir boundary — never removes projectDir itself
   * @param {string} projectDir - Project root (boundary)
   * @param {string} relativeDir - Relative directory to start from
   */
  async removeEmptyParents(projectDir, relativeDir) {
    const resolvedProject = path.resolve(projectDir);
    let current = relativeDir;
    let last = null;
    while (current && current !== '.' && current !== last) {
      last = current;
      const fullPath = path.resolve(projectDir, current);
      // Boundary guard: never traverse outside projectDir
      if (!fullPath.startsWith(resolvedProject + path.sep) && fullPath !== resolvedProject) break;
      try {
        if (!(await fs.pathExists(fullPath))) {
          // Dir already gone — advance current; last is reset at top of next iteration
          current = path.dirname(current);
          continue;
        }
        const remaining = await fs.readdir(fullPath);
        if (remaining.length > 0) break;
        await fs.rmdir(fullPath);
      } catch (error) {
        // ENOTEMPTY: TOCTOU race (file added between readdir and rmdir) — skip level, continue upward
        // ENOENT: dir removed by another process between pathExists and rmdir — skip level, continue upward
        if (error.code === 'ENOTEMPTY' || error.code === 'ENOENT') {
          current = path.dirname(current);
          continue;
        }
        break; // fatal error (e.g. EACCES) — stop upward walk
      }
      current = path.dirname(current);
    }
  }
}

module.exports = { ConfigDrivenIdeSetup };
