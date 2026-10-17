---
title: Install and Troubleshoot SMART
description: Install SMART, configure project skills, and diagnose common setup problems
sidebar:
  order: 1
---

## Requirements

- Node.js 22 or later, with npm.
- A coding assistant such as Codex, Windsurf, Claude Code, or Cursor.
- Internet access for downloading the preview and its npm dependencies.

SMART runs inside your coding assistant. Installing the terminal command and
installing the project skills are two separate steps.

## 1. Check Node.js and npm

Run these commands in your terminal:

```bash
node --version
npm --version
```

Node must report version 22 or later. If it is missing or older, install a
supported Node.js release from [Node.js downloads](https://nodejs.org/en/download)
and reopen your terminal. If you use conda or a Node version manager, activate
the intended environment before installing SMART.

## 2. Install the SMART Command

Copy this complete command. The filename must end in **.tgz**, including the z:

```bash
npm install --global https://github.com/ishwrknt/rmb-aid/releases/download/v6.2.3-smart.2/rmb-aid-6.2.3-smart.2.tgz
smart --version
```

The expected SMART version is `6.2.3-smart.2`.
An npm message such as `added 103 packages` means the package installed.
Warnings do not automatically mean installation failed; check the exit result
and `smart --version`.

SMART is distributed through GitHub Releases. Do not run `npx smart`: it may
install an unrelated package. The compatibility package name is `rmb-aid`;
the executable name is `smart`.

## 3. Install Skills in Your Project

Change into the project where you want to use SMART, not the SMART source repo:

```bash
cd "/media/ishwar/Both_Volume/A_folder/app"
smart install
```

Choose your coding assistant. The default setup selects the recommended modules.
Use `smart install --advanced` for full configuration.

For setup without installer prompts, choose the matching command:

```bash
# Codex
smart install --directory . --modules rmbaid --tools codex --yes

# Windsurf
smart install --directory . --modules rmbaid --tools windsurf --yes
```

The `--yes` flag approves installation defaults. SMART still asks for approval
of your actual development plan when you start a task.

## 4. Verify the Project Files

A new installation creates:

```text
your-project/
  SMART/
    _config/
      manifest.yaml
    core/
    rmbaid/
  SMART-output/
  .agents/skills/rmbaid-smart-pipeline/SKILL.md
```

The last path is for Codex. Other tool locations are:

| Tool        | Pipeline skill                                  |
| ----------- | ----------------------------------------------- |
| Windsurf    | .windsurf/skills/rmbaid-smart-pipeline/SKILL.md |
| Claude Code | .claude/skills/rmbaid-smart-pipeline/SKILL.md   |
| Cursor      | .cursor/skills/rmbaid-smart-pipeline/SKILL.md   |

Version `6.2.3-smart.1` used `_rmbaid/` and `_rmbaid-output/`.
Existing installations retain their directory and output settings on update.
Do not manually rename an existing installation: its manifests and skills may
still reference the old directory. New projects use `SMART/` and `SMART-output/`.
An unrelated, nonempty `SMART/` folder is preserved and setup reports a conflict.

## 5. Start SMART in Your Coding Assistant

Open the same project folder in your assistant. Start a new session or reload
the project so newly installed skills can be discovered.

Send this in the assistant's chat, not the terminal:

```text
Use rmbaid-smart-pipeline to build a Python projectile-motion calculator with tests.
```

Read the plan and reply `yes`, or request changes. To resume later:

```text
Use rmbaid-smart-pipeline to resume this project.
```

The skill keeps its compatibility identifier `rmbaid-smart-pipeline`.
The installation folder is `SMART/`. They serve different purposes.

## Troubleshooting Helper

The standalone helper runs in Bash on Linux, macOS, or WSL.
Download it first, inspect it, then run it; it is not piped directly into a shell.

```bash
curl -fL --retry 2 --connect-timeout 20 --max-time 180 -o smart-install.sh https://github.com/ishwrknt/rmb-aid/releases/download/v6.2.3-smart.2/smart-install.sh
bash smart-install.sh --check --directory . --tool codex
```

A check reports Node and npm versions, disk space, the CLI location, PATH hints,
the project installation folder, and whether the selected skill exists.
Exit code 0 means that check succeeded; 1 means a setup problem; 2 means invalid
arguments. It does not test your assistant's model connection or skill discovery.

Checks do not install anything, edit shell profiles, change npm settings, or
delete project files. Repairs require an explicit action:

```bash
# Install or update the pinned SMART release.
bash smart-install.sh --install

# Use a user-owned global prefix if the default installation gets EACCES.
bash smart-install.sh --user-install

# Install project skills. Existing settings follow the installer update policy.
bash smart-install.sh --setup --directory . --tool codex

# Combine command installation and project setup.
bash smart-install.sh --user-install --setup --directory . --tool windsurf
```

The helper supports `codex`, `windsurf`, `claude-code`, and `cursor`.
For other tools, use `smart install` interactively.
From a source checkout, use `bash tools/smart-install.sh` with the same flags.

## Common Problems

| Symptom                                           | What to do                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| E404 and a URL ending in .tg                      | Copy the full .tgz command from Step 2.                                                         |
| smart: command not found                          | Check that npm install succeeded, then run the helper.                                          |
| Node is too old                                   | Activate Node.js 22 or later and reopen the terminal.                                           |
| EACCES or permission denied during global install | Use the helper's --user-install mode. Do not use sudo as a routine workaround.                  |
| ENOSPC                                            | Free disk space, then retry. The helper does not delete files for you.                          |
| Network timeout                                   | Check connectivity to GitHub and npm, then retry.                                               |
| Both SMART/ and \_rmbaid/ exist                   | Resolve which installation to keep before updating; do not blindly delete either.               |
| Skills installed but unavailable in chat          | Open the correct project folder, reload the assistant, and verify the tool-specific skill path. |
| EPERM or symlink errors on a Linux shared drive   | Try a project under your Linux home directory, where Unix filesystem features are supported.    |

If SMART is installed but its command directory is missing from PATH, run:

```bash
export PATH="$(npm prefix --global)/bin:$PATH"
smart --version
```

After a helper `--user-install`, use:

```bash
export PATH="$HOME/.local/bin:$PATH"
smart --version
```

These exports affect the current terminal. To make the setting permanent,
add the matching export to your own shell startup file.

## Installing from Source

From a source checkout with these changes:

```bash
npm ci
node tools/installer/rmbaid-cli.js install --directory "/path/to/your/project"
```

Use this route for local testing before a new release is uploaded.
See [Release SMART](./release-smart.md) for publishing details.
