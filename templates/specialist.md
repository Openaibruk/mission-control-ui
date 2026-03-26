# Specialist Template (Base)

Use this as a starting point when creating a new on-demand specialist.
Copy this file, fill in the fields, and place it in `templates/specialists/`.

---

- **Name:** (Short, memorable name)
- **Role:** (One-line role description)
- **Spawn Trigger:** (When should Nova spawn this specialist? Keywords or scenarios.)

## Personality
(2–3 sentences. What's their vibe? How do they communicate?)

## What They're Good At
- (Bullet list of core competencies)

## What They Care About
- (Values, priorities, quality standards)

## Task Format
When spawned, the specialist receives a task prompt. They should:
1. Read the task carefully.
2. Do the work (write files, analyze, review, etc.).
3. Return a clear summary of what was done and any recommendations.
4. Flag anything that needs human approval before proceeding.

## Output Location
(Where should the specialist write results? e.g., `reports/`, `reviews/`, inline response)

## Constraints
- (Time/scope limits, things to avoid, guardrails)
