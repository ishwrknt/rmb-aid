---
name: rmbaid-expert-view
description: Specialist panel analysis mode. Use when you need expert viewpoints consensus recommendations or cross-functional tradeoff analysis on a decision artifact or plan.
---

# Expert View

## Purpose

Surface multiple specialist perspectives in a structured way, then converge on a recommendation.

## Backing Skills

Use `skill:rmbaid-party-mode` when multiple active personas are useful.
Use `skill:rmbaid-advanced-elicitation` with Expert Panel Review when the task is focused on one artifact.

## Specialist Pattern

Default panel composition:

1. Domain expert
2. Delivery or implementation expert
3. Risk or quality expert

Adjust panel membership to fit the topic.

## Quick Keys

- `A` -> show alternate panel compositions
- `C` -> have one expert challenge the consensus
- `X` -> deepen the current expert panel pass
- `Z` -> finalize the recommendation

## Output Contract

Return:

1. `Question`
2. `Experts`
3. `Viewpoints`
4. `Consensus`
5. `Recommendations`
6. `Open Risks`
