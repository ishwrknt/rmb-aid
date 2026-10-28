---
title: Renamed Command Layer
description: SMART compatibility layer that recreates a BMAD-style command shell with renamed modes personas and shortcuts
sidebar:
  order: 7
---

## Purpose

SMART now includes a renamed compatibility layer for users who want a command-shell experience instead of memorizing the underlying workflow IDs.

Start with `smart-command-hub`.

## Mode Registry

| Renamed mode  | Shortcuts   | Backing skill         | Use it for                                                 |
| ------------- | ----------- | --------------------- | ---------------------------------------------------------- |
| `elevate`     | `/e`, `EL`  | `smart-elevate`       | Improve a draft, answer, plan, or artifact                 |
| `verify`      | `/v`, `VF`  | `smart-verify`        | Validate quality, correctness, readiness, or review output |
| `expert-view` | `/x`, `XV`  | `smart-expert-view`   | Multi-expert synthesis and recommendations                 |
| `ideate`      | `/i`, `BP`  | `smart-brainstorming` | Explore options and generate ideas                         |
| `squad`       | `/pm`, `PM` | `smart-party-mode`    | Multi-agent collaboration                                  |

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
smart-command-hub
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

| Alias               | Target skill                           |
| ------------------- | -------------------------------------- |
| `/survey-project`   | `smart-document-project`               |
| `/context-forge`    | `smart-generate-project-context`       |
| `/rapid-build`      | `smart-quick-dev`                      |
| `/course-correct`   | `smart-correct-course`                 |
| `/market-scan`      | `smart-market-research`                |
| `/domain-scan`      | `smart-domain-research`                |
| `/stack-scan`       | `smart-technical-research`             |
| `/concept-brief`    | `smart-product-brief`                  |
| `/backcast`         | `smart-prfaq`                          |
| `/blueprint`        | `smart-create-prd`                     |
| `/blueprint-check`  | `smart-validate-prd`                   |
| `/blueprint-revise` | `smart-edit-prd`                       |
| `/journey-design`   | `smart-create-ux-design`               |
| `/system-design`    | `smart-create-architecture`            |
| `/story-map`        | `smart-create-epics-and-stories`       |
| `/readiness-gate`   | `smart-check-implementation-readiness` |
| `/sprint-map`       | `smart-sprint-planning`                |
| `/sprint-pulse`     | `smart-sprint-status`                  |
| `/story-prep`       | `smart-create-story`                   |
| `/story-build`      | `smart-dev-story`                      |
| `/code-check`       | `smart-code-review`                    |
| `/checkpoint-walk`  | `smart-checkpoint-preview`             |
| `/qa-forge`         | `smart-qa-generate-e2e-tests`          |
| `/learn-loop`       | `smart-retrospective`                  |

## Operating Rules

1. One mode or persona per execution window.
2. Use the renamed command first, but keep the underlying SMART skill as the source of truth.
3. If a user is ambiguous, the hub recommends one best-fit mode and one backup.
