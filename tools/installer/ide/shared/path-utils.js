/**
 * Path transformation utilities for IDE installer standardization
 *
 * Provides utilities to convert hierarchical paths to flat naming conventions.
 *
 * DASH-BASED NAMING (new standard):
 * - Agents: smart-agent-module-name.md (with smart-agent- prefix)
 * - Workflows/Tasks/Tools: smart-module-name.md
 *
 * Example outputs:
 * - cis/agents/storymaster.md → smart-agent-cis-storymaster.md
 * - smart/workflows/plan-project.md → smart-smart-plan-project.md
 * - smart/tasks/create-story.md → smart-smart-create-story.md
 * - core/agents/brainstorming.md → smart-agent-brainstorming.md (core agents skip module name)
 * - standalone/agents/fred.md → smart-agent-standalone-fred.md
 */

// Type segments - agents are included in naming, others are filtered out
const TYPE_SEGMENTS = ['workflows', 'tasks', 'tools'];
const AGENT_SEGMENT = 'agents';

// SMART installation folder name - centralized constant for all installers
const SMART_FOLDER_NAME = 'SMART';

/**
 * Convert hierarchical path to flat dash-separated name (NEW STANDARD)
 * Converts: 'smart', 'agents', 'pm' → 'smart-agent-smart-pm.md'
 * Converts: 'smart', 'workflows', 'correct-course' → 'smart-smart-correct-course.md'
 * Converts: 'core', 'agents', 'brainstorming' → 'smart-agent-brainstorming.md' (core agents skip module name)
 * Converts: 'standalone', 'agents', 'fred' → 'smart-agent-standalone-fred.md'
 *
 * @param {string} module - Module name (e.g., 'smart', 'core', 'standalone')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools')
 * @param {string} name - Artifact name (e.g., 'pm', 'brainstorming')
 * @returns {string} Flat filename like 'smart-agent-smart-pm.md' or 'smart-smart-correct-course.md'
 */
function toDashName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;

  // For core module, skip the module name: use 'smart-agent-name.md' instead of 'smart-agent-core-name.md'
  if (module === 'core') {
    return isAgent ? `smart-agent-${name}.md` : `smart-${name}.md`;
  }
  // For standalone module, include 'standalone' in the name
  if (module === 'standalone') {
    return isAgent ? `smart-agent-standalone-${name}.md` : `smart-standalone-${name}.md`;
  }

  // Module artifacts: smart-module-name.md or smart-agent-module-name.md
  // eslint-disable-next-line unicorn/prefer-string-replace-all -- regex replace is intentional here
  const dashName = name.replace(/\//g, '-'); // Flatten nested paths
  return isAgent ? `smart-agent-${module}-${dashName}.md` : `smart-${module}-${dashName}.md`;
}

/**
 * Convert relative path to flat dash-separated name
 * Converts: 'smart/agents/pm.md' → 'smart-agent-smart-pm.md'
 * Converts: 'smart/agents/tech-writer/tech-writer.md' → 'smart-agent-smart-tech-writer.md' (uses folder name)
 * Converts: 'smart/workflows/correct-course.md' → 'smart-smart-correct-course.md'
 * Converts: 'core/agents/brainstorming.md' → 'smart-agent-brainstorming.md' (core agents skip module name)
 *
 * @param {string} relativePath - Path like 'smart/agents/pm.md'
 * @returns {string} Flat filename like 'smart-agent-smart-pm.md' or 'smart-brainstorming.md'
 */
function toDashPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    // Return a safe default for invalid input
    return 'smart-unknown.md';
  }

  // Strip common file extensions to avoid double extensions in generated filenames
  // e.g., 'create-story.xml' → 'create-story', 'workflow.md' → 'workflow'
  const withoutExt = relativePath.replace(/\.(md|yaml|yml|json|xml|toml)$/i, '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  let name;

  // For agents, if nested in a folder (more than 3 parts), use the folder name only
  // e.g., 'smart/agents/tech-writer/tech-writer' → 'tech-writer' (not 'tech-writer-tech-writer')
  if (type === 'agents' && parts.length > 3) {
    // Use the folder name (parts[2]) as the name, ignore the file name
    name = parts[2];
  } else {
    // For non-nested or non-agents, join all parts after type
    name = parts.slice(2).join('-');
  }

  return toDashName(module, type, name);
}

/**
 * Create custom agent dash name
 * Creates: 'smart-custom-agent-fred-commit-poet.md'
 *
 * @param {string} agentName - Custom agent name
 * @returns {string} Flat filename like 'smart-custom-agent-fred-commit-poet.md'
 */
function customAgentDashName(agentName) {
  return `smart-custom-agent-${agentName}.md`;
}

/**
 * Check if a filename uses dash format
 * @param {string} filename - Filename to check
 * @returns {boolean} True if filename uses dash format
 */
function isDashFormat(filename) {
  return filename.startsWith('smart-') && filename.includes('-');
}

/**
 * Extract parts from a dash-formatted filename
 * Parses: 'smart-agent-smart-pm.md' → { prefix: 'smart', module: 'smart', type: 'agents', name: 'pm' }
 * Parses: 'smart-smart-correct-course.md' → { prefix: 'smart', module: 'smart', type: 'workflows', name: 'correct-course' }
 * Parses: 'smart-agent-brainstorming.md' → { prefix: 'smart', module: 'core', type: 'agents', name: 'brainstorming' } (core agents)
 * Parses: 'smart-brainstorming.md' → { prefix: 'smart', module: 'core', type: 'workflows', name: 'brainstorming' } (core workflows)
 * Parses: 'smart-agent-standalone-fred.md' → { prefix: 'smart', module: 'standalone', type: 'agents', name: 'fred' }
 * Parses: 'smart-standalone-foo.md' → { prefix: 'smart', module: 'standalone', type: 'workflows', name: 'foo' }
 *
 * @param {string} filename - Dash-formatted filename
 * @returns {Object|null} Parsed parts or null if invalid format
 */
function parseDashName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('-');

  if (parts.length < 2 || parts[0] !== 'smart') {
    return null;
  }

  // Check if this is an agent file (has 'agent' as second part)
  const isAgent = parts[1] === 'agent';

  if (isAgent) {
    // This is an agent file
    // Format: smart-agent-name (core) or smart-agent-standalone-name or smart-agent-module-name
    if (parts.length >= 4 && parts[2] === 'standalone') {
      // Standalone agent: smart-agent-standalone-name
      return {
        prefix: parts[0],
        module: 'standalone',
        type: 'agents',
        name: parts.slice(3).join('-'),
      };
    }
    if (parts.length === 3) {
      // Core agent: smart-agent-name
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts[2],
      };
    } else {
      // Module agent: smart-agent-module-name
      return {
        prefix: parts[0],
        module: parts[2],
        type: 'agents',
        name: parts.slice(3).join('-'),
      };
    }
  }

  // Not an agent file - must be a workflow/tool/task
  // If only 2 parts (smart-name), it's a core workflow/tool/task
  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows', // Default to workflows for non-agent core items
      name: parts[1],
    };
  }

  // Check for standalone non-agent: smart-standalone-name
  if (parts[1] === 'standalone') {
    return {
      prefix: parts[0],
      module: 'standalone',
      type: 'workflows', // Default to workflows for non-agent standalone items
      name: parts.slice(2).join('-'),
    };
  }

  // Otherwise, it's a module workflow/tool/task (smart-module-name)
  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows', // Default to workflows for non-agent module items
    name: parts.slice(2).join('-'),
  };
}

// ============================================================================
// LEGACY FUNCTIONS (underscore format) - kept for backward compatibility
// ============================================================================

/**
 * Convert hierarchical path to flat underscore-separated name (LEGACY)
 * @deprecated Use toDashName instead
 */
function toUnderscoreName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;
  if (module === 'core') {
    return isAgent ? `rmbaid_agent_${name}.md` : `rmbaid_${name}.md`;
  }
  if (module === 'standalone') {
    return isAgent ? `rmbaid_agent_standalone_${name}.md` : `rmbaid_standalone_${name}.md`;
  }
  return isAgent ? `rmbaid_${module}_agent_${name}.md` : `rmbaid_${module}_${name}.md`;
}

/**
 * Convert relative path to flat underscore-separated name (LEGACY)
 * @deprecated Use toDashPath instead
 */
function toUnderscorePath(relativePath) {
  // Strip common file extensions (same as toDashPath for consistency)
  const withoutExt = relativePath.replace(/\.(md|yaml|yml|json|xml|toml)$/i, '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  const name = parts.slice(2).join('_');

  return toUnderscoreName(module, type, name);
}

/**
 * Create custom agent underscore name (LEGACY)
 * @deprecated Use customAgentDashName instead
 */
function customAgentUnderscoreName(agentName) {
  return `rmbaid_custom_${agentName}.md`;
}

/**
 * Check if a filename uses underscore format (LEGACY)
 * @deprecated Use isDashFormat instead
 */
function isUnderscoreFormat(filename) {
  return filename.startsWith('rmbaid_') && filename.includes('_');
}

/**
 * Extract parts from an underscore-formatted filename (LEGACY)
 * @deprecated Use parseDashName instead
 */
function parseUnderscoreName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('_');

  if (parts.length < 2 || parts[0] !== 'smart') {
    return null;
  }

  const agentIndex = parts.indexOf('agent');

  if (agentIndex !== -1) {
    if (agentIndex === 1) {
      // rmbaid_agent_... - check for standalone
      if (parts.length >= 4 && parts[2] === 'standalone') {
        return {
          prefix: parts[0],
          module: 'standalone',
          type: 'agents',
          name: parts.slice(3).join('_'),
        };
      }
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    } else {
      return {
        prefix: parts[0],
        module: parts[1],
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    }
  }

  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows',
      name: parts[1],
    };
  }

  // Check for standalone non-agent: rmbaid_standalone_name
  if (parts[1] === 'standalone') {
    return {
      prefix: parts[0],
      module: 'standalone',
      type: 'workflows',
      name: parts.slice(2).join('_'),
    };
  }

  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows',
    name: parts.slice(2).join('_'),
  };
}

/**
 * Resolve the skill name for an artifact.
 * Prefers canonicalId from a smart-skill-manifest.yaml sidecar when available,
 * falling back to the path-derived name from toDashPath().
 *
 * @param {Object} artifact - Artifact object (must have relativePath; may have canonicalId)
 * @returns {string} Filename like 'smart-create-prd.md' or 'smart-agent-smart-pm.md'
 */
function resolveSkillName(artifact) {
  if (artifact.canonicalId) {
    return `${artifact.canonicalId}.md`;
  }
  return toDashPath(artifact.relativePath);
}

// Backward compatibility aliases (colon format was same as underscore)
const toColonName = toUnderscoreName;
const toColonPath = toUnderscorePath;
const customAgentColonName = customAgentUnderscoreName;
const isColonFormat = isUnderscoreFormat;
const parseColonName = parseUnderscoreName;

module.exports = {
  // New standard (dash-based)
  toDashName,
  toDashPath,
  resolveSkillName,
  customAgentDashName,
  isDashFormat,
  parseDashName,

  // Legacy (underscore-based) - kept for backward compatibility
  toUnderscoreName,
  toUnderscorePath,
  customAgentUnderscoreName,
  isUnderscoreFormat,
  parseUnderscoreName,

  // Backward compatibility aliases
  toColonName,
  toColonPath,
  customAgentColonName,
  isColonFormat,
  parseColonName,

  TYPE_SEGMENTS,
  AGENT_SEGMENT,
  SMART_FOLDER_NAME,
};
