---
name: smart-squad
description: Renamed collaboration mode for multi-agent discussion and role debate. Use when you want BMAD-style party mode with a simpler command surface.
---

# Squad

## Purpose

Provide a renamed compatibility entrypoint for multi-persona collaboration and debate.

## Backing Skill

This mode is a renamed compatibility layer over `skill:smart-party-mode`.

## Rules

- Choose the smallest useful panel for the question.
- Keep roles explicit.
- End with a synthesis, not a transcript dump.

## Shortcut Deck

- `A` -> show alternate panel compositions
- `C` -> ask one participant to challenge the consensus
- `X` -> expand expert depth on the current topic
- `Z` -> finalize the synthesis

## Output Contract

Return:

1. `Question`
2. `Participants`
3. `Key Positions`
4. `Synthesis`
5. `Recommended Next Command`
