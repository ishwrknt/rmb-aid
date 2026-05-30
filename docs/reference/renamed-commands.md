---
title: Renamed Command Layer
description: SMART compatibility layer that recreates a BMAD-style command shell with renamed modes personas and shortcuts
sidebar:
  order: 7
---

## Purpose

SMART now includes a renamed compatibility layer for users who want a command-shell experience instead of memorizing the underlying workflow IDs.

Start with `rmbaid-command-hub`.

## Mode Registry

| Renamed mode  | Shortcuts   | Backing skill          | Use it for                                                 |
| ------------- | ----------- | ---------------------- | ---------------------------------------------------------- |
| `elevate`     | `/e`, `EL`  | `rmbaid-elevate`       | Improve a draft, answer, plan, or artifact                 |
| `verify`      | `/v`, `VF`  | `rmbaid-verify`        | Validate quality, correctness, readiness, or review output |
| `expert-view` | `/x`, `XV`  | `rmbaid-expert-view`   | Multi-expert synthesis and recommendations                 |
| `ideate`      | `/i`, `BP`  | `rmbaid-brainstorming` | Explore options and generate ideas                         |
| `squad`       | `/pm`, `PM` | `rmbaid-party-mode`    | Multi-agent collaboration                                  |

## Persona Aliases

| Renamed persona | Shortcuts | Existing capability area                    |
| --------------- | --------- | ------------------------------------------- |
| `scout`         | `/sc`     | Discovery, market/domain/technical research |
| `strategist`    | `/st`     | PRD, planning, alignment, sequencing        |
| `systems`       | `/sy`     | Architecture and implementation readiness   |
| `builder`       | `/b`      | Development, review, sprint work            |
| `experience`    | `/ux`     | UX planning and design                      |
| `scribe`        | `/w`      | Documentation, diagrams, explanations       |

## Global Shortcut Keys

| Key | Meaning                       |
| --- | ----------------------------- |
| `A` | Show all commands or methods  |
| `C` | Run a critical challenge pass |
| `X` | Run expert panel analysis     |
| `R` | Reshuffle options             |
| `Z` | Finish, proceed, or exit      |
| `?` | Explain the current mode      |

## Example Usage

```text
rmbaid-command-hub
/elevate
/verify docs/prd.md
/expert-view architecture decision on queue vs event bus
/scout
/builder
/blueprint
/system-design
/story-build
/code-check
```

## Workflow Alias Examples

| Alias               | Target skill                            |
| ------------------- | --------------------------------------- |
| `/survey-project`   | `rmbaid-document-project`               |
| `/context-forge`    | `rmbaid-generate-project-context`       |
| `/rapid-build`      | `rmbaid-quick-dev`                      |
| `/course-correct`   | `rmbaid-correct-course`                 |
| `/market-scan`      | `rmbaid-market-research`                |
| `/domain-scan`      | `rmbaid-domain-research`                |
| `/stack-scan`       | `rmbaid-technical-research`             |
| `/concept-brief`    | `rmbaid-product-brief`                  |
| `/backcast`         | `rmbaid-prfaq`                          |
| `/blueprint`        | `rmbaid-create-prd`                     |
| `/blueprint-check`  | `rmbaid-validate-prd`                   |
| `/blueprint-revise` | `rmbaid-edit-prd`                       |
| `/journey-design`   | `rmbaid-create-ux-design`               |
| `/system-design`    | `rmbaid-create-architecture`            |
| `/story-map`        | `rmbaid-create-epics-and-stories`       |
| `/readiness-gate`   | `rmbaid-check-implementation-readiness` |
| `/sprint-map`       | `rmbaid-sprint-planning`                |
| `/sprint-pulse`     | `rmbaid-sprint-status`                  |
| `/story-prep`       | `rmbaid-create-story`                   |
| `/story-build`      | `rmbaid-dev-story`                      |
| `/code-check`       | `rmbaid-code-review`                    |
| `/checkpoint-walk`  | `rmbaid-checkpoint-preview`             |
| `/qa-forge`         | `rmbaid-qa-generate-e2e-tests`          |
| `/learn-loop`       | `rmbaid-retrospective`                  |

## Operating Rules

1. One mode or persona per execution window.
2. Use the renamed command first, but keep the underlying SMART skill as the source of truth.
3. If a user is ambiguous, the hub recommends one best-fit mode and one backup.
