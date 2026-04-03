const path = require('node:path');
const fs = require('fs-extra');

/**
 * Find the RMB_AID project root directory by looking for package.json
 * or specific RMB_AID markers
 */
function findProjectRoot(startPath = __dirname) {
  let currentPath = path.resolve(startPath);

  // Keep going up until we find package.json with rmb-aid
  while (currentPath !== path.dirname(currentPath)) {
    const packagePath = path.join(currentPath, 'package.json');

    if (fs.existsSync(packagePath)) {
      try {
        const pkg = fs.readJsonSync(packagePath);
        // Check if this is the RMB_AID project
        if (pkg.name === 'rmb-aid' || fs.existsSync(path.join(currentPath, 'src', 'core-skills'))) {
          return currentPath;
        }
      } catch {
        // Continue searching
      }
    }

    // Also check for src/core-skills as a marker
    if (fs.existsSync(path.join(currentPath, 'src', 'core-skills', 'agents'))) {
      return currentPath;
    }

    currentPath = path.dirname(currentPath);
  }

  // If we can't find it, use process.cwd() as fallback
  return process.cwd();
}

// Cache the project root after first calculation
let cachedRoot = null;

function getProjectRoot() {
  if (!cachedRoot) {
    cachedRoot = findProjectRoot();
  }
  return cachedRoot;
}

/**
 * Get path to source directory
 */
function getSourcePath(...segments) {
  return path.join(getProjectRoot(), 'src', ...segments);
}

/**
 * Get path to a module's directory
 * rmbaid is a built-in module directly under src/
 * core is also directly under src/
 * All other modules are stored remote
 */
function getModulePath(moduleName, ...segments) {
  if (moduleName === 'core') {
    return getSourcePath('core-skills', ...segments);
  }
  if (moduleName === 'rmbaid') {
    return getSourcePath('rmbaid-skills', ...segments);
  }
  return getSourcePath('modules', moduleName, ...segments);
}

module.exports = {
  getProjectRoot,
  getSourcePath,
  getModulePath,
  findProjectRoot,
};
