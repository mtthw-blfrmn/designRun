---
name: user-flow
description: Model a product flow as user intent, product objects, system states, decisions, and recovery paths. Use when the user asks for a flow, journey, state model, information architecture path, interaction sequence, or diagram of how a task works.
---

# User flow

Read the project brief and approved decisions. Establish the actor, entry condition, intended outcome, and product object being changed.

Use `templates/user-flow.md`. Read `references/state-model.md` when the flow changes durable data, spans async work, can resume, or includes consequential failure and permission states.

## Build the flow

1. Write the happy path in verbs and outcomes, not screen names alone.
2. At each step, specify what the user knows, what they can do, what the system changes, and what feedback appears.
3. Add guards, validation, permissions, destructive confirmation, async ownership, errors, retry, cancellation, back navigation, invalidation, and resume behavior where relevant.
4. Include empty, loading, success, and partial-completion states.
5. Identify information required too early, hidden system state, irreversible steps, and dead ends.
6. Keep product decisions separate from diagram syntax.

Use a numbered narrative for simple sequences. Use Mermaid or the user's preferred diagram medium when branching or state relationships become difficult to inspect linearly. Add a transition table when effects and recovery must be testable. Every node and edge must have a meaningful label; never invent unsupported backend behavior.

Finish with assumptions, unresolved decisions, and the smallest prototype or test that can validate the riskiest transition. Save the artifact in the owning project and link it from the relevant brief, requirement, or deliverables index.
