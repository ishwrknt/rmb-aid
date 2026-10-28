# 00 — Project Brief

## Project Name

SMART — Simulation Methodology based Agentic Research Tool
(Agentic Coding Edition — built on smart-agentic v6.2.2)

## One-Line Summary

Extend the existing SMART/smart-agentic framework with a full agentic software-delivery
pipeline, a scientific validation layer (Satya + Siddhi), metrics logging
(smart_metrics.jsonl), and a complete Android Physics Tracker case study.

## Background

The smart-agentic repository already contains the SMART framework for scientific
problem-solving: 7 Sanskrit-named agents (Drishti, Bodhi, Tarka, Karma, Yukti,
Satya, Siddhi), workflows, and templates. However, this existing framework is
optimised for single-session research problem-solving, not multi-phase agentic
software delivery.

This project upgrades SMART into a full agentic coding system matching the
runtime prompt specification provided, then applies it to a real case study.

## What Is Being Built

### 1. SMART Agentic Coding Pipeline (new skill)

An installable smart-agentic skill (`smart-pipeline`) that packages the SMART
runtime prompt as a structured, resumable, file-driven pipeline. Any user who
installs smart-agentic can invoke this skill to run SMART on a software project.

Key features:

- PROGRESS.md driven resume/fresh-start
- 8 mandatory planning files before any code
- Phase + epic structure with auto-continuation
- Satya validation gate after every epic
- Siddhi metrics logging to smart_metrics.jsonl

### 2. Agent Enhancements

Upgrade Satya and Siddhi agent definitions for software-development contexts:

- Satya: add software-specific validation methods (unit tests, benchmark
  comparison, cross-platform cross-validation)
- Siddhi: add mandatory smart_metrics.jsonl append as the final step of every
  completed epic

### 3. Physics Tracker Case Study

Demonstrate SMART applied to a real Kotlin/Android app (PhysicsTracker). Produce
all planning-layer documents (brief, PRD, architecture, phase overview, 3 epics)
and a live smart_metrics.jsonl showing real metric entries.

### 4. Metrics Logging Module

A Node.js utility (`src/smart-metrics/`) that other tools and agents can import
to append validated JSONL entries to smart_metrics.jsonl.

## Success Criteria

1. `npm run validate:skills` passes — new skill is structurally valid
2. `npm run lint:md` passes — all new markdown is clean
3. `npm run quality` passes — full gate green
4. Physics Tracker planning suite is internally consistent
5. smart_metrics.jsonl contains at least 3 sample entries with valid schema
6. Metrics logger unit tests pass

## Out of Scope

- Actually running or compiling the Physics Tracker Android app
- Publishing to npm
- CI/CD changes
