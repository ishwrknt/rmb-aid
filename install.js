#!/usr/bin/env node
/**
 * RMB_AID Installer
 * Usage: npx rmb-aid install
 *
 * Installs the RMB_AID framework into the current project directory.
 * Supports: Claude Code, Cursor, Windsurf, Codex, GitHub Copilot, Cline
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const RMBAID_VERSION = '1.0.0';
const CORE_DIR = '.rmbaid-core';

const PLATFORMS = {
  '1': { name: 'Claude Code', dir: '.claude/commands', ext: '.md' },
  '2': { name: 'Cursor', dir: '.cursor/rules', ext: '.mdc' },
  '3': { name: 'Windsurf', dir: '.windsurf/rules', ext: '.md' },
  '4': { name: 'Codex', dir: '.agents/skills', ext: '.md' },
  '5': { name: 'GitHub Copilot', dir: '.github/copilot-instructions', ext: '.md' },
  '6': { name: 'Cline (VS Code)', dir: '.clinerules', ext: '.md' },
  '7': { name: 'All Platforms', dir: null, ext: null }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installForPlatform(platform, projectDir, srcCore) {
  const launcherDir = path.join(projectDir, platform.dir);
  if (!fs.existsSync(launcherDir)) {
    fs.mkdirSync(launcherDir, { recursive: true });
  }

  const agents = ['drishti', 'bodhi', 'tarka', 'yukti', 'karma', 'satya', 'siddhi'];
  for (const agent of agents) {
    const srcAgent = path.join(srcCore, 'agents', `${agent}.md`);
    const destAgent = path.join(launcherDir, `rmbaid-${agent}${platform.ext}`);
    if (fs.existsSync(srcAgent)) {
      fs.copyFileSync(srcAgent, destAgent);
    }
  }

  const srcHelp = path.join(srcCore, 'skills', 'rmbaid-help.md');
  const destHelp = path.join(launcherDir, `rmbaid-help${platform.ext}`);
  if (fs.existsSync(srcHelp)) {
    fs.copyFileSync(srcHelp, destHelp);
  }

  console.log(`  ✓ ${platform.name} → ${platform.dir}`);
}

async function install() {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║           RMB_AID v${RMBAID_VERSION} — Installer                   ║
║   Research Methodology Based AI Development           ║
║                                                       ║
║   Agents: Drishti · Bodhi · Tarka · Yukti            ║
║           Karma · Satya · Siddhi                      ║
╚═══════════════════════════════════════════════════════╝
`);

  console.log('Select your AI platform:\n');
  for (const [key, value] of Object.entries(PLATFORMS)) {
    console.log(`  ${key}. ${value.name}`);
  }

  const choice = await ask('\nEnter number (1-7): ');
  const platform = PLATFORMS[choice.trim()];

  if (!platform) {
    console.error('Invalid choice. Exiting.');
    process.exit(1);
  }

  const projectDir = process.cwd();
  const srcCore = path.join(__dirname, CORE_DIR);
  const destCore = path.join(projectDir, CORE_DIR);

  console.log(`\n→ Installing RMB_AID core to ${destCore}...`);
  copyDir(srcCore, destCore);

  if (platform.dir) {
    installForPlatform(platform, projectDir, srcCore);
  } else {
    for (const candidate of Object.values(PLATFORMS)) {
      if (candidate.dir) {
        installForPlatform(candidate, projectDir, srcCore);
      }
    }
  }

  console.log(`
✅ RMB_AID installed successfully for ${platform.name}!

Next steps:
  1. Open your AI assistant in this project folder
  2. Say: "rmbaid-help" or "@rmbaid-help" to begin
  3. Describe your research problem and let the agents guide you

Agent pipeline:
  Drishti → Bodhi → Tarka → Yukti → Karma → Satya → Siddhi

Happy researching!
`);

  rl.close();
}

install().catch((error) => {
  console.error('Installation failed:', error);
  process.exit(1);
});
