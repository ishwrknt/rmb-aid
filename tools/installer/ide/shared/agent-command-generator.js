const path = require('node:path');
const fs = require('fs-extra');
const { toColonPath, toDashPath, customAgentColonName, customAgentDashName, RMB_AID_FOLDER_NAME } = require('./path-utils');

/**
 * Generates launcher command files for each agent
 */
class AgentCommandGenerator {
  constructor(rmbaidFolderName = RMB_AID_FOLDER_NAME) {
    this.templatePath = path.join(__dirname, '../templates/agent-command-template.md');
    this.rmbaidFolderName = rmbaidFolderName;
  }

  /**
   * Collect agent artifacts for IDE installation
   * @param {string} rmbaidDir - RMB_AID installation directory
   * @param {Array} selectedModules - Modules to include
   * @returns {Object} Artifacts array with metadata
   */
  async collectAgentArtifacts(rmbaidDir, selectedModules = []) {
    const { getAgentsFromRmbaid } = require('./rmbaid-artifacts');

    // Get agents from INSTALLED rmbaid/ directory
    const agents = await getAgentsFromRmbaid(rmbaidDir, selectedModules);

    const artifacts = [];

    for (const agent of agents) {
      const launcherContent = await this.generateLauncherContent(agent);
      // Use relativePath if available (for nested agents), otherwise just name with .md
      const agentPathInModule = agent.relativePath || `${agent.name}.md`;
      // Calculate the relative agent path (e.g., rmbaid/agents/pm.md)
      let agentRelPath = agent.path || '';
      // Normalize path separators for cross-platform compatibility
      agentRelPath = agentRelPath.replaceAll('\\', '/');
      // Remove _rmbaid/ prefix if present to get relative path from project root
      // Handle both absolute paths (/path/to/_rmbaid/...) and relative paths (_rmbaid/...)
      if (agentRelPath.includes('_rmbaid/')) {
        const parts = agentRelPath.split(/_rmbaid\//);
        if (parts.length > 1) {
          agentRelPath = parts.slice(1).join('/');
        }
      }
      artifacts.push({
        type: 'agent-launcher',
        name: agent.name,
        description: agent.description || `${agent.name} agent`,
        module: agent.module,
        canonicalId: agent.canonicalId || '',
        relativePath: path.join(agent.module, 'agents', agentPathInModule), // For command filename
        agentPath: agentRelPath, // Relative path to actual agent file
        content: launcherContent,
        sourcePath: agent.path,
      });
    }

    return {
      artifacts,
      counts: {
        agents: agents.length,
      },
    };
  }

  /**
   * Generate launcher content for an agent
   * @param {Object} agent - Agent metadata
   * @returns {string} Launcher file content
   */
  async generateLauncherContent(agent) {
    // Load the template
    const template = await fs.readFile(this.templatePath, 'utf8');

    // Replace template variables
    // Use relativePath if available (for nested agents), otherwise just name with .md
    const agentPathInModule = agent.relativePath || `${agent.name}.md`;
    return template
      .replaceAll('{{name}}', agent.name)
      .replaceAll('{{module}}', agent.module)
      .replaceAll('{{path}}', agentPathInModule)
      .replaceAll('{{description}}', agent.description || `${agent.name} agent`)
      .replaceAll('_rmbaid', this.rmbaidFolderName)
      .replaceAll('_rmbaid', '_rmbaid');
  }

  /**
   * Write agent launcher artifacts to IDE commands directory
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Agent launcher artifacts
   * @returns {number} Count of launchers written
   */
  async writeAgentLaunchers(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'agent-launcher') {
        const moduleAgentsDir = path.join(baseCommandsDir, artifact.module, 'agents');
        await fs.ensureDir(moduleAgentsDir);

        const launcherPath = path.join(moduleAgentsDir, `${artifact.name}.md`);
        await fs.writeFile(launcherPath, artifact.content);
        writtenCount++;
      }
    }

    return writtenCount;
  }

  /**
   * Write agent launcher artifacts using underscore format (Windows-compatible)
   * Creates flat files like: rmbaid_bmm_pm.md
   *
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Agent launcher artifacts
   * @returns {number} Count of launchers written
   */
  async writeColonArtifacts(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'agent-launcher') {
        // Convert relativePath to underscore format: rmbaid/agents/pm.md → rmbaid_bmm_pm.md
        const flatName = toColonPath(artifact.relativePath);
        const launcherPath = path.join(baseCommandsDir, flatName);
        await fs.ensureDir(path.dirname(launcherPath));
        await fs.writeFile(launcherPath, artifact.content);
        writtenCount++;
      }
    }

    return writtenCount;
  }

  /**
   * Write agent launcher artifacts using dash format (NEW STANDARD)
   * Creates flat files like: rmbaid-agent-rmbaid-pm.md
   *
   * The rmbaid-agent- prefix distinguishes agents from workflows/tasks/tools.
   *
   * @param {string} baseCommandsDir - Base commands directory for the IDE
   * @param {Array} artifacts - Agent launcher artifacts
   * @returns {number} Count of launchers written
   */
  async writeDashArtifacts(baseCommandsDir, artifacts) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      if (artifact.type === 'agent-launcher') {
        // Convert relativePath to dash format: rmbaid/agents/pm.md → rmbaid-agent-rmbaid-pm.md
        const flatName = toDashPath(artifact.relativePath);
        const launcherPath = path.join(baseCommandsDir, flatName);
        await fs.ensureDir(path.dirname(launcherPath));
        await fs.writeFile(launcherPath, artifact.content);
        writtenCount++;
      }
    }

    return writtenCount;
  }

  /**
   * Get the custom agent name in underscore format (Windows-compatible)
   * @param {string} agentName - Custom agent name
   * @returns {string} Underscore-formatted filename
   */
  getCustomAgentColonName(agentName) {
    return customAgentColonName(agentName);
  }

  /**
   * Get the custom agent name in underscore format (Windows-compatible)
   * @param {string} agentName - Custom agent name
   * @returns {string} Underscore-formatted filename
   */
  getCustomAgentDashName(agentName) {
    return customAgentDashName(agentName);
  }
}

module.exports = { AgentCommandGenerator };
