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
    'src/rmbaid-skills/rmbaid-smart-pipeline/SKILL.md',
    'src/smart-metrics/logger.js',
    'src/smart-metrics/schema.js',
    'smart/pipeline.md',
    'smart/startup.md',
    'tools/installer/commands/prompt.js',
  ]) {
    assert(files.has(required), `Missing packaged file: ${required}`);
  }
  assert(!files.has('smart_metrics.jsonl'), 'Development metrics must not be shipped');
  run('tar', ['-xzf', path.join(temp, packed.filename), '-C', temp]);
  // Reuse npm-ci dependencies, including ESM imports, without network in CI.
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'package/node_modules'), 'junction');
  const cli = path.join(temp, 'package/tools/installer/rmbaid-cli.js');
  const prompt = run(process.execPath, [cli, 'prompt'], temp);
  assert(prompt.startsWith('# SMART Pipeline'));
  assert(prompt.includes('Approval must be explicit'));
  assert(prompt.includes('five retries per epic'));
  assert(!prompt.includes('Update Available'));
  assert(run(process.execPath, [cli, '--help'], temp).includes('prompt'));

  const project = path.join(temp, 'project');
  fs.mkdirSync(project);
  const args = [cli, 'install', '--directory', project, '--modules', 'rmbaid', '--tools', 'codex,windsurf', '--yes'];
  run(process.execPath, args, temp);
  const installedSkill = path.join(project, '.agents/skills/rmbaid-smart-pipeline/SKILL.md');
  assert(fs.existsSync(installedSkill), 'SMART pipeline must be installed for Codex');
  assert(fs.readFileSync(installedSkill, 'utf8').includes('Approval must be explicit'));
  assert(fs.existsSync(path.join(project, '.windsurf/skills/rmbaid-smart-pipeline/SKILL.md')), 'SMART must be installed for Windsurf');
  const progress = path.join(project, 'PROGRESS.md');
  const progressContent = '# Existing user progress\n- [ ] Keep my work\n';
  fs.writeFileSync(progress, progressContent);
  run(process.execPath, args, temp);
  assert.equal(fs.readFileSync(progress, 'utf8'), progressContent, 'Reinstall must preserve user progress');
  console.log('SMART package: required assets, offline CLI, clean install, and reinstall passed.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
