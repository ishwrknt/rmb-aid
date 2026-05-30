---
name: rmbaid-verify
description: Renamed compatibility mode for validation and review. Use when you want to check correctness completeness readiness or risks across code docs plans or generated artifacts.
---

# Verify

## Purpose

Run the right validation path for the target artifact while keeping a single simple command surface.

## Routing Rules

Choose exactly one primary validation path:

- General quality/risk review -> `skill:rmbaid-review-adversarial-general`
- Edge-case and failure-mode sweep -> `skill:rmbaid-review-edge-case-hunter`
- Prose/document polish -> `skill:rmbaid-editorial-review-prose`
- Document structure/cohesion review -> `skill:rmbaid-editorial-review-structure`
- PRD validation -> `skill:rmbaid-validate-prd`
- Story validation -> `skill:rmbaid-create-story` with `validate`

If the user does not specify the artifact type, ask one targeted clarification question.

## Quick Keys

- `A` -> show all validation paths
- `C` -> add a critical challenge pass after the primary check
- `E` -> escalate to edge-case hunting
- `Z` -> finalize the verdict and stop

## Output Contract

Return:

1. `Target`
2. `Validation Path`
3. `Checks Run`
4. `Findings`
5. `Verdict`
6. `Next Step`

## Guardrails

- Do not mix multiple primary validation paths unless the user asks for a pipeline.
- Findings first, summary second.
- If no issues are found, say that explicitly and mention residual risks or test gaps.
