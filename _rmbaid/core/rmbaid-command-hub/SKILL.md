---
name: rmbaid-command-hub
description: Renamed BMAD-style command shell and router. Use when you want slash commands shortcut aliases renamed personas and one-mode-at-a-time routing across RMB_AID.
---

# RMB_AID Command Hub

## Purpose

Provide an easy entrypoint that feels like a mode engine instead of a document library. Route the user into exactly one mode or persona at a time.

## Critical Rules

- Enforce one active mode or persona per execution window.
- If the user gives a direct slash command, alias, menu code, or persona name, route immediately.
- If the user is ambiguous, recommend one best-fit command and stop for confirmation.
- Prefer the renamed compatibility layer first, then the underlying RMB_AID skill name.
- Treat `A` as show all commands, `C` as challenge/critical review, `Z` as finish/proceed/exit the active mode.

## Registry

Load and follow `./registry.md`.
Load `./workflow-aliases.md` when the user asks for the full renamed workflow catalog.

## Routing Contract

For every routed response, provide:

1. `Mode` — selected renamed command or persona
2. `Why` — one sentence explaining the fit
3. `Target` — exact RMB_AID skill to invoke
4. `Shortcuts` — accepted slash aliases or quick letters

## Direct Command Handling

Accept these command forms:

- Slash commands such as `/elevate`, `/verify`, `/expert-view`, `/scout`, `/strategist`, `/systems`, `/builder`, `/experience`, `/scribe`, `/ideate`, `/squad`
- Short aliases such as `/e`, `/v`, `/x`, `/sc`, `/st`, `/sy`, `/b`, `/ux`, `/w`, `/i`, `/pm`
- Bare names such as `elevate`, `verify`, `expert view`, `scout`
- Menu codes such as `EL`, `VF`, `XV`, `BP`, `PM`, `CP`, `CA`, `DS`

## Execution Map

- `elevate` -> `skill:rmbaid-elevate`
- `verify` -> `skill:rmbaid-verify`
- `expert-view` -> `skill:rmbaid-expert-view`
- `scout` -> `skill:rmbaid-scout`
- `strategist` -> `skill:rmbaid-strategist`
- `systems` -> `skill:rmbaid-systems-designer`
- `builder` -> `skill:rmbaid-builder`
- `experience` -> `skill:rmbaid-experience-designer`
- `scribe` -> `skill:rmbaid-scribe`
- `ideate` -> `skill:rmbaid-brainstorming`
- `squad` -> `skill:rmbaid-party-mode`
- `help` -> `skill:rmbaid-help`

For workflow-level slash aliases such as `/blueprint`, `/system-design`, `/story-build`, or `/code-check`, consult `./workflow-aliases.md` and route to the mapped RMB_AID skill.

## Fallback Behavior

If no clear route exists:

1. Summarize the detected intent
2. Offer the best command
3. Offer one alternative
4. Wait for the user to choose
