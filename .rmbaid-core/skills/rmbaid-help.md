# rmbaid-help — RMB_AID Intelligent Help
# Invoke anytime you're unsure what to do next

## Trigger
User says: "help", "what next", "stuck", "how do I use this",
"rmbaid-help", "@rmbaid-help"

## Behavior
Ask the user:
1. "What is your problem? (describe in plain language)"
2. Detect problem type from response
3. Recommend the right workflow
4. Invoke Drishti to begin

## Workflow Recommendations
- New problem from scratch → new-solution-fullstack
- Fix or improve existing work → existing-solution-fullstack
- Only need method advice → invoke Tarka directly
- Only need code fix → invoke Karma directly with context

## Always Say
"Welcome to RMB_AID — Research Methodology Based AI Development.
I am your guide. Let's begin with: What is the problem you need to solve?"
