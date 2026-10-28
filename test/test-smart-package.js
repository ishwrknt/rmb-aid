const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-package-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const env = { ...process.env, SMART_NO_UPDATE_CHECK: '1', NODE_PATH: path.join(root, 'node_modules') };

function run(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, env, encoding: 'utf8', timeout: 120_000, stdio: ['ignore', 'pipe', 'pipe'] });
}

try {
  const [packed] = JSON.parse(run(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', temp]));
  const files = new Set(packed.files.map((file) => file.path));
  for (const required of [
    'src/smart-skills/smart-pipeline/SKILL.md',
    'src/smart-metrics/logger.js',
    'src/smart-metrics/schema.js',
    'smart/pipeline.md',
    'smart/startup.md',
    'tools/installer/commands/prompt.js',
    'tools/smart-install.sh',
  ]) {
    assert(files.has(required), `Missing packaged file: ${required}`);
  }
  assert(!files.has('smart_metrics.jsonl'), 'Development metrics must not be shipped');
  run('tar', ['-xzf', path.join(temp, packed.filename), '-C', temp]);
  // Reuse npm-ci dependencies, including ESM imports, without network in CI.
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'package/node_modules'), 'junction');
  const cli = path.join(temp, 'package/tools/installer/smart-cli.js');
  const prompt = run(process.execPath, [cli, 'prompt'], temp);
  assert(prompt.startsWith('# SMART Pipeline'));
  assert(prompt.includes('Approval must be explicit'));
  assert(prompt.includes('five retries per epic'));
  assert(!prompt.includes('Update Available'));
  assert(run(process.execPath, [cli, '--help'], temp).includes('prompt'));

  const project = path.join(temp, 'project');
  fs.mkdirSync(project);
  const args = [cli, 'install', '--directory', project, '--modules', 'smart', '--tools', 'codex,windsurf', '--yes'];
  run(process.execPath, args, temp);
  assert(fs.existsSync(path.join(project, 'SMART/_config/manifest.yaml')), 'Fresh installations must use SMART/');
  assert(!fs.existsSync(path.join(project, '_rmbaid')), 'Fresh installations must not create _rmbaid/');
  assert(fs.existsSync(path.join(project, 'SMART-output')), 'New output folders must use SMART-output/');
  const installedHelp = fs.readFileSync(path.join(project, '.agents/skills/smart-help/SKILL.md'), 'utf8');
  assert(installedHelp.includes('{project-root}/SMART/'), 'Installed skills must reference SMART/');
  assert(!installedHelp.includes('{project-root}/_rmbaid/'), 'Installed skills must not reference the legacy root');
  const installedSkill = path.join(project, '.agents/skills/smart-pipeline/SKILL.md');
  assert(fs.existsSync(installedSkill), 'SMART pipeline must be installed for Codex');
  assert(fs.readFileSync(installedSkill, 'utf8').includes('Approval must be explicit'));
  assert(fs.existsSync(path.join(project, '.windsurf/skills/smart-pipeline/SKILL.md')), 'SMART must be installed for Windsurf');
  const progress = path.join(project, 'PROGRESS.md');
  const progressContent = '# Existing user progress\n- [ ] Keep my work\n';
  fs.writeFileSync(progress, progressContent);
  run(process.execPath, args, temp);
  assert.equal(fs.readFileSync(progress, 'utf8'), progressContent, 'Reinstall must preserve user progress');
  // Simulate the older directory layout, then exercise the full update path.
  fs.renameSync(path.join(project, 'SMART'), path.join(project, '_rmbaid'));
  const yaml = require('yaml');
  for (const module of ['core', 'smart']) {
    const configFile = path.join(project, '_rmbaid', module, 'config.yaml');
    const config = yaml.parse(fs.readFileSync(configFile, 'utf8'));
    config.output_folder = '{project-root}/_rmbaid-output';
    fs.writeFileSync(configFile, yaml.stringify(config));
  }
  fs.writeFileSync(path.join(project, '_rmbaid/user-note.txt'), 'Preserve legacy user content.');
  run(process.execPath, args, temp);
  assert(!fs.existsSync(path.join(project, 'SMART')), 'Legacy updates must not create a parallel SMART installation');
  assert(fs.existsSync(path.join(project, '_rmbaid/user-note.txt')), 'Legacy user files must be preserved');
  assert(yaml.parse(fs.readFileSync(path.join(project, '_rmbaid/core/config.yaml'), 'utf8')).output_folder.includes('_rmbaid-output'));
  assert(fs.readFileSync(path.join(project, '.agents/skills/smart-help/SKILL.md'), 'utf8').includes('{project-root}/_rmbaid/'));
  console.log('SMART package: required assets, offline CLI, clean install, and reinstall passed.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
