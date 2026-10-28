# SMART

Open source framework for structured, agent-assisted software delivery.

## Rules

- Use Conventional Commits for every commit.
- Before pushing, run `npm ci && npm run quality` on `HEAD` in the exact checkout you are about to push.
  `quality` mirrors the checks in `.github/workflows/quality.yaml`.

- Skill validation rules are in `tools/skill-validator.md`.
- Deterministic skill checks run via `npm run validate:skills` (included in `quality`).

## SMART conversation routing

- `smart`, `@smart`, or `/smart` starts or resumes the SMART pipeline in
  `src/smart-skills/smart-pipeline/SKILL.md`, using the current task.
  With no task and no matching unfinished session, ask what to work on.
- Direct calls `@drishti`, `@bodhi`, `@tarka`, `@tarak`, `@yukti`, `@karma`,
  `@satya`, and `@siddhi` select that named persona. Bare names and slash forms
  also work, case-insensitively. `tarak` is an alias for Tarka.
- For named calls, follow `src/core-skills/smart-command-hub/SKILL.md` and its
  `smart-personas.md`. Speak as the person (`**Drishti:** ...`), use the current
  context, and perform their role. Keep internal routing labels out of the reply.
- Individual calls stay with that agent; `smart` coordinates automatic handoffs
  through Drishti → Bodhi → Tarka → Yukti → Karma → Satya → Siddhi, respecting
  the pipeline’s approval and validation gates.
