---
name: project-setup
description: Create and frame a new product-design project inside designRun. Use when the user wants to add, initialize, onboard, or define a product, or when design work has no owning project folder yet.
---

# Project setup

## Create the project

1. Establish a human-readable name and a stable lowercase slug. Do not silently merge it with a similar project.
2. Prefer `npm run new:project -- "<Product name>"`. If Node is unavailable, copy `templates/project/` into the new slug and replace every template token manually. Never overwrite an existing folder.
3. Read the generated project `AGENTS.md` and `brief.md`.

Before attaching implementation work, inventory the target repository, nested agent instructions, runtime/build commands, package manager, supported environments, data and auth boundaries, generated files, ignored/private paths, and publishing target. Do not assume the designRun repository is the implementation repository.

## Shape the brief

Ask for or infer only what is needed for the next useful design artifact:

- the product in one sentence
- the primary user and situation
- the problem and desired outcome
- important product objects
- now, later, and non-goals
- material technical, business, legal, data, brand, and timing constraints
- observable success

Mark reversible low-risk inferences as assumptions. Ask a focused question when the answer would change the product promise, primary user, privacy boundary, implementation target, or release scope.

## Finish setup

- Replace prompts in `brief.md` with concrete project context; leave honest unknowns rather than invented detail.
- Add supplied evidence to `research.md` with provenance and limitations.
- Put approved choices, not brainstorms, in `decisions.md`.
- Record implementation repositories and boundaries in `deliverables.md`.
- Keep customer-private or licensed source material in ignored local storage and link to it only when appropriate.
- Record data classification, source licenses, secret-handling expectations, and the explicit publishing boundary before artifacts begin to accumulate.
- Suggest the smallest next artifact or prototype that reduces the most important uncertainty.
