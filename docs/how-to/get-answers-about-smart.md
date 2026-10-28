---
title: 'How to Get Answers About SMART'
description: Use an LLM to quickly answer your own SMART questions
sidebar:
  order: 4
---

## Start Here: SMART-Help

**The fastest way to get answers about SMART is the `smart-help` skill.** This intelligent guide will answer upwards of 80% of all questions and is available to you directly in your IDE as you work.

SMART-Help is more than a lookup tool — it:

- **Inspects your project** to see what's already been completed
- **Understands natural language** — ask questions in plain English
- **Varies based on your installed modules** — shows relevant options
- **Auto-runs after workflows** — tells you exactly what to do next
- **Recommends the first required task** — no guessing where to start

### How to Use SMART-Help

Call it by name in your AI session:

```
smart-help
```

:::tip
You can also use `/smart-help` or `$smart-help` depending on your platform, but just `smart-help` should work everywhere.
:::

Combine it with a natural language query:

```
smart-help I have a SaaS idea and know all the features. Where do I start?
smart-help What are my options for UX design?
smart-help I'm stuck on the PRD workflow
smart-help Show me what's been done so far
```

SMART-Help responds with:

- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

## When to Use This Guide

Use this section when:

- You want to understand SMART's architecture or internals
- You need answers outside of what SMART-Help provides
- You're researching SMART before installing
- You want to explore the source code directly

## Steps

### 1. Choose Your Source

| Source               | Best For                                   | Examples                      |
| -------------------- | ------------------------------------------ | ----------------------------- |
| **`_rmbaid` folder** | How SMART works—agents, workflows, prompts | "What does the PM agent do?"  |
| **Full GitHub repo** | History, installer, architecture           | "What changed in v6?"         |
| **`llms-full.txt`**  | Quick overview from docs                   | "Explain SMART's four phases" |

The `_rmbaid` folder is created when you install SMART. If you don't have it yet, clone the repo instead.

### 2. Point Your AI at the Source

**If your AI can read files (Claude Code, Cursor, etc.):**

- **SMART installed:** Point at the `_rmbaid` folder and ask directly
- **Want deeper context:** Clone the [full repo](https://github.com/smart-code-org/SMART)

**If you use ChatGPT or Claude.ai:**

Fetch `llms-full.txt` into your session:

```text
https://smart-code-org.github.io/SMART/llms-full.txt
```

### 3. Ask Your Question

:::note[Example]
**Q:** "Tell me the fastest way to build something with SMART"

**A:** Use Quick Flow: Run `smart-quick-dev` — it clarifies your intent, plans, implements, reviews, and presents results in a single workflow, skipping the full planning phases.
:::

## What You Get

Direct answers about SMART—how agents work, what workflows do, why things are structured the way they are—without waiting for someone else to respond.

## Tips

- **Verify surprising answers** — LLMs occasionally get things wrong. Check the source file or ask on Discord.
- **Be specific** — "What does step 3 of the PRD workflow do?" beats "How does PRD work?"

## Still Stuck?

Tried the LLM approach and still need help? You now have a much better question to ask.

| Channel                   | Use For                                     |
| ------------------------- | ------------------------------------------- |
| `#smart-agentic-help`     | Quick questions (real-time chat)            |
| `help-requests` forum     | Detailed questions (searchable, persistent) |
| `#suggestions-feedback`   | Ideas and feature requests                  |
| `#report-bugs-and-issues` | Bug reports                                 |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/smart-code-org/SMART/issues](https://github.com/smart-code-org/SMART/issues) (for clear bugs)

_You!_
_Stuck_
_in the queue—_
_waiting_
_for who?_

_The source_
_is there,_
_plain to see!_

_Point_
_your machine._
_Set it free._

_It reads._
_It speaks._
_Ask away—_

_Why wait_
_for tomorrow_
_when you have_
_today?_

_—Claude_
