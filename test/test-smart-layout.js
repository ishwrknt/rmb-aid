const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { resolveInstallDirectory, rewriteInstallPaths } = require('../tools/installer/core/install-layout');
const { AgentCommandGenerator } = require('../tools/installer/ide/shared/agent-command-generator');

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'smart-layout-'));
  try {
    assert.equal(await resolveInstallDirectory(root), path.join(root, 'SMART'));
    const agent = { name: 'sample', module: 'core', description: 'Sample agent' };
    const launcher = await new AgentCommandGenerator().generateLauncherContent(agent);
    assert(launcher.includes('SMART/'));
    assert(!launcher.includes('_rmbaid/'));
    assert((await new AgentCommandGenerator('_rmbaid').generateLauncherContent(agent)).includes('_rmbaid/'));
    await fs.mkdir(path.join(root, 'SMART'));
    assert.equal(await resolveInstallDirectory(root), path.join(root, 'SMART'));
    await fs.writeFile(path.join(root, 'SMART', 'user.txt'), 'Leave untouched');
    await assert.rejects(resolveInstallDirectory(root), /already exists/);
    assert.equal(await fs.readFile(path.join(root, 'SMART', 'user.txt'), 'utf8'), 'Leave untouched');
    await fs.mkdir(path.join(root, '_rmbaid/_config'), { recursive: true });
    await fs.writeFile(path.join(root, '_rmbaid/_config/manifest.yaml'), 'installation: {}\n');
    assert.equal(await resolveInstallDirectory(root), path.join(root, '_rmbaid'));
    await fs.mkdir(path.join(root, 'SMART/_config'), { recursive: true });
    await fs.writeFile(path.join(root, 'SMART/_config/manifest.yaml'), 'installation: {}\n');
    await assert.rejects(resolveInstallDirectory(root), /Both SMART/);
    const sample = '{project-root}/_rmbaid/core/config.yaml\n{project-root}/SMART/core/config.yaml\n_rmbaid-output\ninstall_to_rmbaid\n';
    const updated = rewriteInstallPaths(sample, 'SMART');
    assert.equal(updated.match(/SMART\/core/g).length, 2);
    assert(updated.includes('_rmbaid-output'));
    assert(updated.includes('install_to_rmbaid'));
    assert(rewriteInstallPaths('{project-root}/SMART/core/config.yaml', '_rmbaid').includes('/_rmbaid/core/'));
    assert.equal(
      rewriteInstallPaths(String.raw`{project-root}/\_rmbaid/\_config/file.csv`, 'SMART'),
      String.raw`{project-root}/SMART/\_config/file.csv`,
    );
    console.log('SMART layout: fresh, empty, collision, legacy, ambiguous roots, and path rewrites passed.');
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
