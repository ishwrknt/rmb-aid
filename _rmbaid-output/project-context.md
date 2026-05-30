---
project_name: 'SMART'
user_name: 'Ishwar'
date: '2026-04-04'
sections_completed: ['project_focus', 'technology_stack', 'critical_rules', 'current_work']
---

# Project Context for AI Agents

## Project Focus

- SMART is the active project identity and user-facing brand.
- Preserve compatibility where useful, including existing `rmbaid`, `rmb-aid`, and `_rmbaid` package, command, and folder names during the transition.
- Prefer SMART branding in user-facing docs and installer output over older BMAD or RMB_AID naming.
- The framework keeps the BMAD-style workflow structure, with SMART acting as the reasoning layer on top.

## Technology Stack & Key Paths

- Runtime: Node.js 22+
- Package manager: npm
- CLI entrypoint: `tools/installer/rmbaid-cli.js`
- Install command handler: `tools/installer/commands/install.js`
- Installer UI flow: `tools/installer/ui.js`
- Module config collection: `tools/installer/modules/official-modules.js`
- Core reasoning prompt: `.rmbaid-core/rmbaid-core.md`
- Primary docs: `README.md`, `docs/how-to/`, `docs/reference/`, `docs/tutorials/`
- Localized docs: `docs/fr/`, `docs/vi-vn/`, `README_VN.md`

## Critical Implementation Rules

- Prefer `npx rmb-aid install` as the primary documented install command.
- The published npm package name is `rmb-aid`.
- Treat `rmbaid` as a CLI/bin alias, not the primary public `npx` package name.
- Default installer UX should be simple:
- Use recommended modules automatically.
- Skip optional custom-content prompts unless explicitly requested.
- Use defaults for core and module configuration unless an important value is missing.
- Keep an explicit advanced escape hatch rather than removing configurability.
- Current advanced installer flag: `--advanced`
- Do not remove existing compatibility behavior unless the user asks for a breaking change.
- Be careful in this repo: the worktree may already be dirty with unrelated edits. Avoid broad search-replace operations without scoping.

## Current Work Snapshot

- The SMART core orchestrator prompt has been updated to use the five-layer SMART reasoning protocol:
- GPS state-space framing
- model-based reasoning
- Zeigler simulation pipeline
- scientific-method hypothesis requirement
- systems-theory abstraction
- Main installer/docs command surface has been shifted to `rmbaid`.
- Installer behavior was simplified so plain interactive install asks fewer questions by default.
- Full interactive configuration remains available through `npx rmb-aid install --advanced`.

## Verification Notes

- Syntax checks completed for:
- `tools/installer/rmbaid-cli.js`
- `tools/installer/commands/install.js`
- `tools/installer/commands/uninstall.js`
- `tools/installer/ui.js`
- `tools/installer/modules/official-modules.js`
- Full `npm ci && npm run quality` has not been run in this session because the checkout contains many unrelated in-progress changes, so a repo-wide result would not isolate this change set cleanly.
