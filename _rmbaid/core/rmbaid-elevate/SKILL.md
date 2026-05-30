---
name: rmbaid-elevate
description: Renamed compatibility mode for BMAD-style promote. Use when you want to improve the latest answer draft plan or artifact through structured critique and refinement.
---

# Elevate

## Purpose

Provide a renamed upgrade pass over the current output without changing the underlying RMB_AID architecture.

## Backing Skill

This mode is a renamed compatibility layer over `skill:rmbaid-advanced-elicitation`.

## Required Behavior

- Stay in Elevate mode until the user exits with `Z`.
- Work on the most recent artifact, response, plan, or document section unless the user gives a different target.
- Improve quality without silently changing accepted constraints.
- After every refinement pass, show the delta and ask whether to apply it.

## Shortcut Deck

- `A` -> list all available refinement methods
- `C` -> run a critical challenge pass
- `X` -> run expert panel review
- `R` -> reshuffle and suggest new methods
- `Z` -> finish and return the accepted version

## Output Contract

Return these sections:

1. `Target`
2. `Method`
3. `Findings`
4. `Proposed Upgrade`
5. `Apply?`

## Method Guidance

Prefer these methods first when fitting:

- Critique and Refine
- First Principles Analysis
- Socratic Questioning
- Pre-mortem Analysis
- Challenge from Critical Perspective
- Expert Panel Review

If the user asks for deeper or alternate techniques, expand to the full `skill:rmbaid-advanced-elicitation` behavior.
