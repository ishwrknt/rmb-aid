# RMB_AID Workflow: New Solution — Full Pipeline
# Use when: Starting from scratch on any new research or computational problem

## Trigger
User says: "solve", "figure out", "build solution for", "I have a problem",
"help me compute", "analyze", "model this", "simulate"

## Pipeline
1. Invoke Drishti → Produce PDD
2. Invoke Bodhi → Produce Knowledge Map
3. Invoke Tarka → Produce Method Hypothesis
4. Invoke Yukti → Produce Method Plan
5. Invoke Karma → Produce Implementation
6. Invoke Satya → Produce Validation Report
7. Invoke Siddhi → Produce Final Deliverable

## Context Passing
Each agent receives all previous documents in context.
Never start an agent without passing all upstream documents.

## Loop Conditions
- Satya FAIL → return to Karma or Yukti
- Yukti uncertainty → return to Tarka
- Bodhi finds an existing solution → report before proceeding

## Exit Condition
Siddhi produces Final Deliverable. Session complete.
