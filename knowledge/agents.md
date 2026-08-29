# Agent operating model

This file defines how agents work inside designRun. It is constitutional: keep durable system decisions here and product-specific decisions in each project's `decisions.md`.

## First principles

1. The designer is the author. Agents amplify judgment; they do not replace it.
2. `taste/taste.md` and the analyzed records in `inspiration/library/` are global. Projects cite them without copying them.
3. `resources/design-system.md` turns judgment into reusable execution: tokens, themes, components, motion, accessibility, and promotion rules.
4. Project folders hold product facts, evidence, prototypes, decisions, and deliverable records.
5. Markdown is the durable memory layer. The control center and agent harness read the same sources.
6. Working prototypes are preferred when flow, hierarchy, motion, or product feel must be experienced.
7. Figma, code, research repositories, and external tools may be sources of truth for a specific artifact. designRun records their boundaries and relationships.
8. Add a file only when its ownership is clear and it will be useful again.
9. The source order for product UI is: taste → shared system → project strategy and design sources → project components → product flows.
10. Project components prove patterns locally. Shared standards change only through explicit promotion.

## Source ownership

- `taste/taste.md` owns design principles, preferences, and anti-patterns.
- `inspiration/references.md` owns the library procedure; `inspiration/library/` owns the individual reference records and what should be learned from each source.
- `knowledge/todos.md` owns the To‑Do area in the control center.
- `resources/design-system.md` owns shared tokens, themes, component standards, and inheritance.
- `resources/accessibility.md`, `motion.md`, and `content.md` own their specialist quality bars.
- `resources/tools.md` explains available tools, why they matter, and when to use them.
- `resources/raw-assets/` is unreviewed intake; `resources/asset-library/` is curated reusable material.
- `.agents/skills/` owns reusable workflows.
- `projects/<project>/` owns product-specific context and artifact records.
- `patterns/` owns reviewed patterns that are reusable but not yet foundational system rules.

## Agent behavior

1. Read the root `AGENTS.md`, then the active project's guidance.
2. Load only sources that can change the outcome.
3. Separate evidence, decisions, assumptions, and open questions.
4. Make a recommendation when enough context exists.
5. Create or modify the artifact in its owning folder or repository.
6. Inspect or test the result in the medium that can prove it.
7. Update durable decisions and source indexes before finishing.
8. Surface promotion candidates, but do not promote them automatically.

## Product-design protocol

For UI, UX, interaction, or visual work:

1. Read Taste and the shared design system.
2. Read the project's brief, decisions, and any named Figma or implementation sources.
3. Inspect referenced images, video, or live UI directly.
4. Reuse project components before adding flow-local variants.
5. Define new values semantically; avoid one-off styling that cannot explain itself.
6. Cover important states: empty, loading, working, success, error, disabled, focus, keyboard, responsive, and reduced motion.
7. Verify in a real render when the result is code-backed.

Concept exploration is allowed to diverge. Do not force current-product layout or implementation constraints onto a narrowly scoped concept unless the user asks for fit or fidelity.

## Projects and deliverables

A project is the organizing object. Its documents may include a brief, research, decisions, prototype notes, and a deliverables index. A deliverable is a concrete app, prototype, deck, export, or maintained artifact inside that project.

Code may live inside the project or in a separate repository. Record the exact boundary in `deliverables.md`: local path, repository, stable branch, working branch, restore point, local URL, and exclusions. Never assume the whole workspace shares one repository or publishing target.

## Evidence and context

Save important source material near the artifact it informs. For a requirements document, keep a context packet or index that names each transcript, screenshot, spreadsheet, design source, or URL and explains what it contributed. Sensitive raw files stay local and ignored by Git unless the designer explicitly decides otherwise.

## Promotion loop

Patterns move upward only after use:

```text
project experiment → working prototype → reusable project component
  → cross-project review → pattern or shared system rule
```

Promotion must remove product names, private data, brand-specific values, and assumptions that do not travel. Record tradeoffs and accessibility consequences, not only the successful appearance.

## Local control center

The app is a product surface over workspace sources. It should:

- Discover new projects and Markdown by convention.
- Make Taste, To‑Do, Inspiration, Assets, Design System, Tools, Skills, and Projects first-class areas.
- Use cards and rows for browsable objects; use flat, readable layouts for full documents.
- Search and filter the actual source index.
- Save edits back to the source file with modification-time conflict checks.
- Use browser storage only for unsaved drafts, never as the saved source of truth.

## External actions and privacy

Local work does not authorize publishing, deployment, uploads, account creation, messages, purchases, or changes to connected services. Ask when external impact is not explicitly authorized. Never expose secrets or private source content in logs, commits, screenshots, or public artifacts.
