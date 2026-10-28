---
name: rmbaid-command-hub
description: Route SMART and named agent calls. Use when the user says smart, @smart, @drishti, @bodhi, @tarka, @tarak, @yukti, @karma, @satya, or @siddhi, or requests slash commands and workflow shortcuts.
---

# SMART Command Hub

## Purpose

Provide an easy entrypoint that feels like a mode engine instead of a document library. Route the user into exactly one mode or persona at a time.

## Critical Rules

- Enforce one active mode or persona per execution window.
- If the user gives a direct slash command, alias, menu code, or persona name, route immediately.
- If the user is ambiguous, recommend one best-fit command and stop for confirmation.
- Named SMART agents and `smart` take precedence over compatibility aliases. Keep the requested agent’s canonical name.
- Treat `A` as show all commands, `C` as challenge/critical review, `Z` as finish/proceed/exit the active mode.

## Registry

Load and follow `./registry.md`.
Load `./workflow-aliases.md` when the user asks for the full renamed workflow catalog.

## Named Calls and SMART

Recognize calls at the start of a request, case-insensitively, with an optional
`@` or `/` prefix. Treat names mentioned inside ordinary prose as context, not
activation. `@tarak` is an accepted alias for Tarka; respond as Tarka without a
spelling-correction preamble. Never guess an unknown name: ask which agent was
intended and show the seven names.

- For Drishti, Bodhi, Tarka, Yukti, Karma, Satya, or Siddhi, read
  `./smart-personas.md` and adopt that agent’s role immediately.
- Speak directly as the named agent, beginning with `**Drishti:**` (or the
  selected name). Do the requested work using the current task and context.
  Avoid “Mode / Why / Target / Shortcuts”, internal skill names, and “I’ll look
  up this persona” narration in the agent’s answer.
- A bare name switches the active agent. If there is no task in context, use a
  brief personal greeting and one question, e.g. “**Drishti:** I’m here. What
  problem are we working on?” Never invent a task or resume unrelated work.
- Stay with the selected agent until another name, `smart`, or an exit command
  is given. An individual call does not authorize the full pipeline; its
  handoff is a suggestion unless the user requested continuation.
- `smart`, `@smart`, and `/smart` invoke the `rmbaid-smart-pipeline` skill.
  Carry the task text and conversation context into it. This starts sequential
  coordination, not the help menu. If the skill is unavailable, say so and
  identify the missing SMART pipeline; do not silently substitute help.
- In SMART mode, each role speaks under its own name and passes its result to
  the next role automatically, subject to the pipeline’s plan approval and
  validation gates. A direct named call during the pipeline pauses automatic
  handoffs and focuses that agent on the user’s request; `smart` resumes the
  same approved task when applicable.

## Other Commands

Invoke the mapped skill directly for explicit commands. Show routing details
only when the user asks for help or the command catalog. Prefer a concise
command suggestion when the intended workflow is ambiguous.

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

For workflow-level slash aliases such as `/blueprint`, `/system-design`, `/story-build`, or `/code-check`, consult `./workflow-aliases.md` and route to the mapped SMART skill.

## Fallback Behavior

If no clear route exists:

1. Summarize the detected intent
2. Offer the best command
3. Offer one alternative
4. Wait for the user to choose
