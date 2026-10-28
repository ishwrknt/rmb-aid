# Renamed Command Registry

## SMART Calls

`smart`, `@smart`, `/smart`: invoke the `rmbaid-smart-pipeline` skill for
sequential coordination. Named calls select one agent directly:
`@drishti`, `@bodhi`, `@tarka` (also `@tarak`), `@yukti`, `@karma`, `@satya`,
`@siddhi`. Bare names and slash forms are also accepted, case-insensitively.
Read `./smart-personas.md` for their roles. These names take precedence over
compatibility personas below.

## Operating Modes

| Command       | Aliases     | Purpose                                                              | Underlying Skill       | Output Shape                                       |
| ------------- | ----------- | -------------------------------------------------------------------- | ---------------------- | -------------------------------------------------- |
| `elevate`     | `/e`, `EL`  | Improve the latest output through structured critique and refinement | `rmbaid-elevate`       | Mode, critique, proposed upgrade, accepted changes |
| `verify`      | `/v`, `VF`  | Validate quality, correctness, readiness, or review an artifact      | `rmbaid-verify`        | Mode, checks run, findings, verdict, next step     |
| `expert-view` | `/x`, `XV`  | Get specialist viewpoints with consensus and recommendations         | `rmbaid-expert-view`   | Mode, viewpoints, consensus, recommendations       |
| `ideate`      | `/i`, `BP`  | Run guided ideation and option expansion                             | `rmbaid-brainstorming` | Goal, idea set, shortlist, next move               |
| `squad`       | `/pm`, `PM` | Use multi-agent collaboration and role debate                        | `rmbaid-party-mode`    | Participants, discussion, synthesis, action        |

## Persona Aliases

| Persona      | Aliases | Purpose                                                    | Underlying Skill             |
| ------------ | ------- | ---------------------------------------------------------- | ---------------------------- |
| `scout`      | `/sc`   | Research, discovery, competitive/domain/technical analysis | `rmbaid-scout`               |
| `strategist` | `/st`   | Product planning, PRD work, story planning alignment       | `rmbaid-strategist`          |
| `systems`    | `/sy`   | Architecture and implementation readiness                  | `rmbaid-systems-designer`    |
| `builder`    | `/b`    | Development, story execution, review, sprint work          | `rmbaid-builder`             |
| `experience` | `/ux`   | UX design and experience definition                        | `rmbaid-experience-designer` |
| `scribe`     | `/w`    | Documentation, diagrams, explanations, document validation | `rmbaid-scribe`              |

## Global Quick Keys

| Key | Meaning                                                        |
| --- | -------------------------------------------------------------- |
| `A` | Show all commands or all available methods in the current mode |
| `C` | Run a critical challenge pass on the current output            |
| `X` | Run expert panel analysis                                      |
| `R` | Reshuffle or re-offer alternate methods                        |
| `Z` | Finish, proceed, or exit the active mode                       |
| `?` | Explain the current mode and available shortcuts               |

## Execution Rules

1. One mode at a time.
2. Do not mix `elevate`, `verify`, and `expert-view` in one pass unless the user explicitly chains them.
3. When a mode ends with `Z`, return control to the previously active persona or the command hub.
4. If the user references an old BMAD-style command concept, route to the renamed equivalent first.
5. If a user wants the full renamed workflow catalog, load `./workflow-aliases.md`.
