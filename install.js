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

function getCodexSkillDescription(skillId) {
  const descriptions = {
    'rmbaid-help': 'Guide the user to the right RMB_AID workflow or next step.',
    'rmbaid-drishti': 'Frame the research or computational problem before solving it.',
    'rmbaid-bodhi': 'Map existing knowledge, tools, and solution gaps for the problem.',
    'rmbaid-tarka': 'Form a falsifiable method hypothesis with explicit success criteria.',
    'rmbaid-yukti': 'Select the computational method, tools, and evaluation pipeline.',
    'rmbaid-karma': 'Implement the selected method as clean, runnable code.',
    'rmbaid-satya': 'Validate the implementation against the defined criteria.',
    'rmbaid-siddhi': 'Package the validated solution into a usable deliverable.'
  };

  return descriptions[skillId] || 'RMB_AID skill';
}

function toCodexSkillContent(skillId, body) {
  return `---
name: ${skillId}
description: ${getCodexSkillDescription(skillId)}
---

${body}`;
}

function installCodexSkills(projectDir, srcCore, platform) {
  const launcherDir = path.join(projectDir, platform.dir);
  if (!fs.existsSync(launcherDir)) {
    fs.mkdirSync(launcherDir, { recursive: true });
  }

  const skills = [
    { id: 'rmbaid-help', source: path.join(srcCore, 'skills', 'rmbaid-help.md') },
    { id: 'rmbaid-drishti', source: path.join(srcCore, 'agents', 'drishti.md') },
    { id: 'rmbaid-bodhi', source: path.join(srcCore, 'agents', 'bodhi.md') },
    { id: 'rmbaid-tarka', source: path.join(srcCore, 'agents', 'tarka.md') },
    { id: 'rmbaid-yukti', source: path.join(srcCore, 'agents', 'yukti.md') },
    { id: 'rmbaid-karma', source: path.join(srcCore, 'agents', 'karma.md') },
    { id: 'rmbaid-satya', source: path.join(srcCore, 'agents', 'satya.md') },
    { id: 'rmbaid-siddhi', source: path.join(srcCore, 'agents', 'siddhi.md') }
  ];

  for (const skill of skills) {
    if (!fs.existsSync(skill.source)) {
      continue;
    }

    const skillDir = path.join(launcherDir, skill.id);
    fs.mkdirSync(skillDir, { recursive: true });
    const body = fs.readFileSync(skill.source, 'utf8');
    const content = toCodexSkillContent(skill.id, body);
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
  }

  console.log(`  ✓ ${platform.name} → ${platform.dir}`);
}

function installForPlatform(platform, projectDir, srcCore) {
  if (platform.name === 'Codex') {
    installCodexSkills(projectDir, srcCore, platform);
    return;
  }

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
