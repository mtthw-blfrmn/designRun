---
name: todo-extractor
description: Extract actionable to-dos from meeting transcripts, notes, calls, feedback, email or chat threads, PRD discussions, and messy product conversations. Use when the user asks for action items, follow-ups, a task list, or to separate explicit and inferred work from a source.
---

# To-do extractor

Turn messy source material into an action inventory the designer can triage in designRun.

## Workflow

1. Read the source completely.
2. Identify concrete actions, bugs, product or design changes, follow-ups, decisions, and artifacts to create.
3. Classify each item as `explicit` when it was assigned or promised, or `inferred` when it is necessary but was not directly assigned.
4. Set urgency to `urgent`, `high`, `medium`, or `low` from source evidence. Do not manufacture urgency.
5. Add a due date only when one is supplied or a relative date can be resolved safely.
6. Add an owner only when named or obvious from the assignment.
7. Preserve one short context sentence; do not paste long excerpts.

## Quality bar

- Begin task titles with a verb.
- Preserve the product object, surface, customer, or artifact that makes the task concrete.
- Split actions with different owners, timing, or outcomes.
- Merge true duplicates without losing distinct context.
- Exclude broad themes that do not imply an action.
- Do not expand tasks into requirements unless asked.

## Source-backed save

When asked to add tasks to the shared To‑Do area, update the JSON block in `knowledge/todos.md` and preserve its schema:

- `id`
- `title`
- `description`
- `project`
- `type`: `explicit` or `inferred`
- `owner`: `me`, `agent`, a named person, or empty
- `dueDate`: ISO date or empty
- `size`: `1`, `2`, or `3`
- `urgency`: `urgent`, `high`, `medium`, or `low`
- `completed`
- `createdAt`
- `updatedAt`

Before writing, reread the current JSON, deduplicate against durable IDs and outcomes, apply all changes in one edit, preserve unknown fields, and run `npm run validate`. Never overwrite concurrent changes from another agent; if the source changed during extraction, merge by ID and report conflicts. Use a durable project to-do document instead when the work should not appear in the global control center.
