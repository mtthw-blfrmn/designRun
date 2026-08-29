# Worked sample

`projects/relay-sample/` is a fictional, synthetic product included to show how designRun sources work together. Relay is not a real company or customer, its volunteer-outreach workflow is invented for the template, and every person, organization, finding, metric, constraint, and requirement is sample data.

## Trace the project

1. `brief.md` defines the product boundary, actors, objects, outcomes, scope, and open questions.
2. `research.md` records synthetic evidence with stable IDs and limitations.
3. `decisions.md` records approved sample decisions and their revisit conditions.
4. `user-flow.md` models state transitions, recovery, invalidation, and resume behavior.
5. `deliverables/outreach-workspace/prd.md` traces evidence and decisions into numbered requirements, acceptance criteria, and verification.
6. `prototype-notes.md` separates tested observations from unproven promotion candidates.
7. `knowledge/todos.md` includes one open and one completed sample task associated with the project.

Use the sample to learn structure, not as product evidence. Agents must never carry its users, objects, decisions, data model, or requirements into a new project unless the user explicitly asks to explore an analogous behavior.

## Remove the sample

Delete `projects/relay-sample/`, then remove the two `sample-relay-*` objects from the JSON array in `knowledge/todos.md`. Run `npm run validate && npm run index`. The control center will return to a clean first-project state.

