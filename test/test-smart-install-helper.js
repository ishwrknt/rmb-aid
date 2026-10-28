const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

if (process.platform === 'win32') {
  console.log('Bash helper tests require Linux, macOS, or WSL.');
  process.exit(0);
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-helper-'));
const bin = path.join(root, 'bin');
const project = path.join(root, 'project with spaces');
const globalRoot = path.join(root, 'global modules');
const home = path.join(root, 'home with spaces');
const log = path.join(root, 'calls.log');
const helper = path.join(root, 'smart-install.sh');
for (const dir of [bin, project, globalRoot, home]) fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(path.join(__dirname, '../tools/smart-install.sh'), helper);

fs.writeFileSync(
  path.join(bin, 'node'),
  `#!/bin/bash
if [[ "$1" == --version ]]; then printf '%s\\n' "$FAKE_NODE_VERSION"; exit; fi
if [[ "$2" == --version ]]; then printf '6.2.3-smart.2\\n'; exit; fi
printf '%s\\n' "$@" >> "$CALL_LOG"
if [[ "$2" == install ]]; then
  shift 2
  target=''; tool=''
  while (($#)); do
    case "$1" in
      --directory) target="$2"; shift 2 ;;
      --tools) tool="$2"; shift 2 ;;
      *) shift ;;
    esac
  done
  case "$tool" in
    codex) skills='.agents/skills' ;;
    windsurf) skills='.windsurf/skills' ;;
    claude-code) skills='.claude/skills' ;;
    cursor) skills='.cursor/skills' ;;
  esac
  mkdir -p "$target/SMART/_config" "$target/$skills/smart-pipeline"
  printf 'installation: {}\\n' > "$target/SMART/_config/manifest.yaml"
  printf '# SMART\\n' > "$target/$skills/smart-pipeline/SKILL.md"
fi
`,
  { mode: 0o755 },
);

fs.writeFileSync(
  path.join(bin, 'npm'),
  `#!/bin/bash
case "$1" in
  --version) printf '11.0.0\\n' ;;
  root) printf '%s\\n' "$FAKE_GLOBAL_ROOT" ;;
  prefix) printf '%s\\n' "$FAKE_PREFIX" ;;
  install)
    printf '%s\\n' "$@" >> "$CALL_LOG"
    [[ "$FAKE_INSTALL_FAIL" == 0 ]] || { printf 'EACCES test failure\\n' >&2; exit 1; }
    dest="$FAKE_GLOBAL_ROOT"
    while (($#)); do
      if [[ "$1" == --prefix ]]; then dest="$2/lib/node_modules"; shift 2; else shift; fi
    done
    mkdir -p "$dest/smart-agentic/tools/installer"
    printf '// fixture\\n' > "$dest/smart-agentic/tools/installer/smart-cli.js"
    ;;
esac
`,
  { mode: 0o755 },
);

function run(args, extra = {}) {
  return spawnSync('/bin/bash', [helper, ...args], {
    encoding: 'utf8',
    timeout: 10_000,
    env: {
      ...process.env,
      HOME: home,
      PATH: `${bin}:/usr/bin:/bin`,
      FAKE_NODE_VERSION: 'v24.0.0',
      FAKE_INSTALL_FAIL: '0',
      FAKE_GLOBAL_ROOT: globalRoot,
      FAKE_PREFIX: root,
      CALL_LOG: log,
      ...extra,
    },
  });
}

try {
  assert.equal(run(['--help']).status, 0);
  assert.equal(run(['--tool', 'unknown']).status, 2);
  assert.equal(run(['--directory']).status, 2);
  const oldNode = run(['--check'], { FAKE_NODE_VERSION: 'v18.0.0' });
  assert.equal(oldNode.status, 1);
  assert(oldNode.stderr.includes('too old'));
  const absent = run(['--check', '--directory', project]);
  assert.equal(absent.status, 1);
  assert(absent.stderr.includes('not installed'));
  assert(!fs.existsSync(log), 'Checks must not install anything');
  const failed = run(['--install'], { FAKE_INSTALL_FAIL: '1' });
  assert.equal(failed.status, 1);
  assert(failed.stderr.includes('--user-install'));
  const installed = run(['--install']);
  assert.equal(installed.status, 0, installed.stderr);
  assert(fs.readFileSync(log, 'utf8').includes('smart-agentic@6.2.3-smart.2'));
  assert.equal(run(['--setup', '--directory', project, '--tool', 'windsurf']).status, 0);
  assert(fs.existsSync(path.join(project, '.windsurf/skills/smart-pipeline/SKILL.md')));
  const before = fs.readFileSync(log, 'utf8');
  assert.equal(run(['--check', '--directory', project, '--tool', 'windsurf']).status, 0);
  assert.equal(fs.readFileSync(log, 'utf8'), before, 'Checks must not invoke setup or npm install');
  const userInstalled = run(['--user-install']);
  assert.equal(userInstalled.status, 0, userInstalled.stderr);
  assert(userInstalled.stdout.includes('.local/bin'));
  assert(fs.existsSync(path.join(home, '.local/lib/node_modules/smart-agentic/tools/installer/smart-cli.js')));
  assert(!fs.existsSync(path.join(home, '.bashrc')), 'User install must not edit shell profiles');
  assert(!fs.existsSync(path.join(home, '.npmrc')), 'User install must not change npm settings');
  const sentinel = path.join(project, 'PROGRESS.md');
  fs.writeFileSync(sentinel, 'User progress');
  assert.equal(run(['--check', '--directory', project, '--tool', 'windsurf']).status, 0);
  assert.equal(fs.readFileSync(sentinel, 'utf8'), 'User progress');
  fs.renameSync(path.join(project, 'SMART'), path.join(project, '_rmbaid'));
  const legacy = run(['--check', '--directory', project, '--tool', 'windsurf']);
  assert.equal(legacy.status, 0);
  assert(legacy.stdout.includes('legacy installation'));
  console.log(
    'SMART helper: argument validation, Node compatibility, read-only checks, install failures, global/user installs, quoted paths, setup, and legacy detection passed.',
  );
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
