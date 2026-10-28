---
title: 'Getting Started'
description: Install SMART and build your first project
---

Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

## What You'll Learn

- Install and initialize SMART for a new project
- Use **SMART-Help** — your intelligent guide that knows what to do next
- Choose the right planning track for your project size
- Progress through phases from requirements to working code
- Use agents and workflows effectively

:::note[Prerequisites]

- **Node.js 20+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, or similar
- **A project idea** — Even a simple one works for learning
  :::

:::tip[The Easiest Path]
**Install** → `npx smart-agentic install`
**Ask** → `smart-help what should I do first?`
**Build** → Let SMART-Help guide you workflow by workflow
:::

## Meet SMART-Help: Your Intelligent Guide

**SMART-Help is the fastest way to get started with SMART.** You don't need to memorize workflows or phases — just ask, and SMART-Help will:

- **Inspect your project** to see what's already been done
- **Show your options** based on which modules you have installed
- **Recommend what's next** — including the first required task
- **Answer questions** like "I have a SaaS idea, where do I start?"

### How to Use SMART-Help

Run it in your AI IDE by invoking the skill:

```
smart-help
```

Or combine it with a question for context-aware guidance:

```
smart-help I have an idea for a SaaS product, I already know all the features I want. where do I get started?
```

SMART-Help will respond with:

- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

### It Powers Workflows Too

SMART-Help doesn't just answer questions — **it automatically runs at the end of every workflow** to tell you exactly what to do next. No guessing, no searching docs — just clear guidance on the next required workflow.

:::tip[Start Here]
After installing SMART, invoke the `smart-help` skill immediately. It will detect what modules you have installed and guide you to the right starting point for your project.
:::

## Understanding SMART

SMART helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name           | What Happens                                                 |
| ----- | -------------- | ------------------------------------------------------------ |
| 1     | Analysis       | Brainstorming, research, product brief or PRFAQ _(optional)_ |
| 2     | Planning       | Create requirements (PRD or spec)                            |
| 3     | Solutioning    | Design architecture _(SMART/Enterprise only)_                |
| 4     | Implementation | Build epic by epic, story by story                           |

**[Open the Workflow Map](../reference/workflow-map.md)** to explore phases, workflows, and context management.

Based on your project's complexity, SMART offers three planning tracks:

| Track          | Best For                                               | Documents Created                      |
| -------------- | ------------------------------------------------------ | -------------------------------------- |
| **Quick Flow** | Bug fixes, simple features, clear scope (1-15 stories) | Tech-spec only                         |
| **SMART**      | Products, platforms, complex features (10-50+ stories) | PRD + Architecture + UX                |
| **Enterprise** | Compliance, multi-tenant systems (30+ stories)         | PRD + Architecture + Security + DevOps |

:::note
Story counts are guidance, not definitions. Choose your track based on planning needs, not story math.
:::

## Installation

Open a terminal in your project directory and run:

```bash
npx smart-agentic install
```

If you want the newest prerelease build instead of the default release channel, use `npx smart-agentic@next install`.

When prompted to select modules, choose **SMART**.

The installer creates two folders:

- `_rmbaid/` — agents, workflows, tasks, and configuration
- `_rmbaid-output/` — empty for now, but this is where your artifacts will be saved

:::tip[Your Next Step]
Open your AI IDE in the project folder and run:

```
smart-help
```

SMART-Help will detect what you've completed and recommend exactly what to do next. You can also ask it questions like "What are my options?" or "I have a SaaS idea, where should I start?"
:::

:::note[How to Load Agents and Run Workflows]
Each workflow has a **skill** you invoke by name in your IDE (e.g., `smart-create-prd`). Your AI tool will recognize the `smart-*` name and run it — you don't need to load agents separately. You can also invoke an agent skill directly for general conversation (e.g., `smart-agent-pm` for the PM agent).
:::

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 1: Create Your Plan

Work through phases 1-3. **Use fresh chats for each workflow.**

:::tip[Project Context (Optional)]
Before starting, consider creating `project-context.md` to document your technical preferences and implementation rules. This ensures all AI agents follow your conventions throughout the project.

Create it manually at `_rmbaid-output/project-context.md` or generate it after architecture using `smart-generate-project-context`. [Learn more](../explanation/project-context.md).
:::

### Phase 1: Analysis (Optional)

All workflows in this phase are optional. [**Not sure which to use?**](../explanation/analysis-phase.md)

- **brainstorming** (`smart-brainstorming`) — Guided ideation
- **research** (`smart-market-research` / `smart-domain-research` / `smart-technical-research`) — Market, domain, and technical research
- **product-brief** (`smart-product-brief`) — Recommended foundation document when your concept is clear
- **prfaq** (`smart-prfaq`) — Working Backwards challenge to stress-test and forge your product concept

### Phase 2: Planning (Required)

**For SMART and Enterprise tracks:**

1. Invoke the **PM agent** (`smart-agent-pm`) in a new chat
2. Run the `smart-create-prd` workflow (`smart-create-prd`)
3. Output: `PRD.md`

**For Quick Flow track:**

- Run `smart-quick-dev` — it handles planning and implementation in a single workflow, skip to implementation

:::note[UX Design (Optional)]
If your project has a user interface, invoke the **UX-Designer agent** (`smart-agent-ux-designer`) and run the UX design workflow (`smart-create-ux-design`) after creating your PRD.
:::

### Phase 3: Solutioning (SMART/Enterprise)

**Create Architecture**

1. Invoke the **Architect agent** (`smart-agent-architect`) in a new chat
2. Run `smart-create-architecture` (`smart-create-architecture`)
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

:::tip[V6 Improvement]
Epics and stories are now created _after_ architecture. This produces better quality stories because architecture decisions (database, API patterns, tech stack) directly affect how work should be broken down.
:::

1. Invoke the **PM agent** (`smart-agent-pm`) in a new chat
2. Run `smart-create-epics-and-stories` (`smart-create-epics-and-stories`)
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** _(Highly Recommended)_

1. Invoke the **Architect agent** (`smart-agent-architect`) in a new chat
2. Run `smart-check-implementation-readiness` (`smart-check-implementation-readiness`)
3. Validates cohesion across all planning documents

## Step 2: Build Your Project

Once planning is complete, move to implementation. **Each workflow should run in a fresh chat.**

### Initialize Sprint Planning

Invoke the **Developer agent** (`smart-agent-dev`) and run `smart-sprint-planning` (`smart-sprint-planning`). This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow             | Command              | Purpose                            |
| ---- | ----- | -------------------- | -------------------- | ---------------------------------- |
| 1    | DEV   | `smart-create-story` | `smart-create-story` | Create story file from epic        |
| 2    | DEV   | `smart-dev-story`    | `smart-dev-story`    | Implement the story                |
| 3    | DEV   | `smart-code-review`  | `smart-code-review`  | Quality validation _(recommended)_ |

After completing all stories in an epic, invoke the **Developer agent** (`smart-agent-dev`) and run `smart-retrospective` (`smart-retrospective`).

## What You've Accomplished

You've learned the foundation of building with SMART:

- Installed SMART and configured it for your IDE
- Initialized a project with your chosen planning track
- Created planning documents (PRD, Architecture, Epics & Stories)
- Understood the build cycle for implementation

Your project now has:

```text
your-project/
├── _rmbaid/                                   # SMART configuration
├── _rmbaid-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Your requirements document
│   │   ├── architecture.md                  # Technical decisions
│   │   └── epics/                           # Epic and story files
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Sprint tracking
│   └── project-context.md                   # Implementation rules (optional)
└── ...
```

## Quick Reference

| Workflow                               | Command                                | Agent     | Purpose                                    |
| -------------------------------------- | -------------------------------------- | --------- | ------------------------------------------ |
| **`smart-help`** ⭐                    | `smart-help`                           | Any       | **Your intelligent guide — ask anything!** |
| `smart-create-prd`                     | `smart-create-prd`                     | PM        | Create Product Requirements Document       |
| `smart-create-architecture`            | `smart-create-architecture`            | Architect | Create architecture document               |
| `smart-generate-project-context`       | `smart-generate-project-context`       | Analyst   | Create project context file                |
| `smart-create-epics-and-stories`       | `smart-create-epics-and-stories`       | PM        | Break down PRD into epics                  |
| `smart-check-implementation-readiness` | `smart-check-implementation-readiness` | Architect | Validate planning cohesion                 |
| `smart-sprint-planning`                | `smart-sprint-planning`                | DEV       | Initialize sprint tracking                 |
| `smart-create-story`                   | `smart-create-story`                   | DEV       | Create a story file                        |
| `smart-dev-story`                      | `smart-dev-story`                      | DEV       | Implement a story                          |
| `smart-code-review`                    | `smart-code-review`                    | DEV       | Review implemented code                    |

## Common Questions

**Do I always need architecture?**
Only for SMART and Enterprise tracks. Quick Flow skips from spec to implementation.

**Can I change my plan later?**
Yes. The `smart-correct-course` workflow handles scope changes mid-implementation.

**What if I want to brainstorm first?**
Invoke the Analyst agent (`smart-agent-analyst`) and run `smart-brainstorming` (`smart-brainstorming`) before starting your PRD.

**Do I need to follow a strict order?**
Not strictly. Once you learn the flow, you can run workflows directly using the Quick Reference above.

## Getting Help

:::tip[First Stop: SMART-Help]
**Invoke `smart-help` anytime** — it's the fastest way to get unstuck. Ask it anything:

- "What should I do after installing?"
- "I'm stuck on workflow X"
- "What are my options for Y?"
- "Show me what's been done so far"

SMART-Help inspects your project, detects what you've completed, and tells you exactly what to do next.
:::

- **During workflows** — Agents guide you with questions and explanations
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#smart-agentic-help, #report-bugs-and-issues)

## Key Takeaways

:::tip[Remember These]

- **Start with `smart-help`** — Your intelligent guide that knows your project and options
- **Always use fresh chats** — Start a new chat for each workflow
- **Track matters** — Quick Flow uses `smart-quick-dev`; Method/Enterprise need PRD and architecture
- **SMART-Help runs automatically** — Every workflow ends with guidance on what's next
  :::

Ready to start? Install SMART, invoke `smart-help`, and let your intelligent guide lead the way.
