# Epic 01 — SMART Pipeline Skill

Phase: Phase 1 — SMART Agentic Coding Pipeline
Agent: Karma
Status: IN PROGRESS

## Goal

Package the SMART agentic coding runtime prompt as a valid, installable rmb-aid
skill (`rmbaid-smart-pipeline`) so any user who runs `npx rmb-aid` gets the full
pipeline available as a slash command or skill invocation.

## Acceptance Criteria

- `src/rmbaid-skills/rmbaid-smart-pipeline/SKILL.md` exists
- Passes all 14 deterministic skill rules (`npm run validate:skills`)
- Description starts with "Use when" and is ≥ 50 characters
- Skill name matches directory basename exactly

## Implementation Notes

The SKILL.md body must explain:

1. How to trigger SMART pipeline (fresh vs. resume)
2. The 4-layer agent pipeline
3. What the user needs to provide (plain language task only)
4. Where deliverables are written (file system)

## Satya Validation Method

Structural: `npm run validate:skills --strict` passes with 0 HIGH findings.
