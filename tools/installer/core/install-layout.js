const path = require('node:path');
const fs = require('fs-extra');
const { SMART_FOLDER_NAME } = require('../ide/shared/path-utils');

const LEGACY_FOLDER_NAME = '_rmbaid';

async function resolveInstallDirectory(projectDir) {
  const root = path.resolve(projectDir);
  const current = path.join(root, SMART_FOLDER_NAME);
  const legacy = path.join(root, LEGACY_FOLDER_NAME);
  const isInstallation = async (dir) => (await fs.stat(path.join(dir, '_config', 'manifest.yaml')).catch(() => null))?.isFile();
  const [hasCurrent, hasLegacy] = await Promise.all([isInstallation(current), isInstallation(legacy)]);
  if (hasCurrent && hasLegacy) {
    throw new Error('Both SMART/ and _rmbaid/ installations exist. Keep one active installation before updating.');
  }
  if (hasLegacy) return legacy;
  if (hasCurrent) return current;
  if (await fs.pathExists(current)) {
    const stat = await fs.stat(current);
    if (!stat.isDirectory() || (await fs.readdir(current)).length > 0) {
      throw new Error(
        'SMART already exists without an installation manifest. Choose another project directory; existing files were preserved.',
      );
    }
  }
  return current;
}

// Rewrite path components only, retaining output-folder names and skill IDs.
function rewriteInstallPaths(content, folderName) {
  return content
    .replaceAll(String.raw`/\_rmbaid/`, `/${folderName}/`)
    .replaceAll(/(^|[^a-zA-Z0-9_-])(?:_rmbaid|SMART)(?=[/\\])/g, (_match, prefix) => prefix + folderName);
}

async function rewriteInstalledFile(file, folderName) {
  if (!new Set(['.md', '.yaml', '.yml', '.json', '.csv', '.xml', '.toml', '.txt']).has(path.extname(file))) return;
  const content = await fs.readFile(file, 'utf8');
  const updated = rewriteInstallPaths(content, folderName);
  if (updated !== content) await fs.writeFile(file, updated, 'utf8');
}

module.exports = { resolveInstallDirectory, rewriteInstallPaths, rewriteInstalledFile };
