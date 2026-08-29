---
name: design-critique
description: Critique an actual product design or implementation against its intent, project evidence, taste, system rules, and interaction quality. Use when the user asks to review, evaluate, critique, pressure-test, or improve a screen, flow, prototype, or UI implementation.
---

# Design critique

Critique the artifact the user supplied, not an imagined version. Inspect the relevant screen, image, prototype, Figma node, or running implementation directly when tools permit. Read the brief, approved decisions, and relevant taste, design-system, accessibility, motion, and content sources.

## Evaluate in this order

1. **Product intent** — Can the intended user understand the object, state, and next action? Does the design solve the named problem?
2. **Flow and behavior** — Are transitions, feedback, recovery, and edge states coherent?
3. **Hierarchy and content** — Is attention ordered correctly? Is language concrete and placed at the decision point?
4. **System integrity** — Are tokens, components, responsive rules, and interaction states consistent without flattening useful distinctions?
5. **Accessibility** — Check semantics, keyboard path, focus, contrast, target size, reflow, reduced motion, and status communication as relevant.
6. **Craft** — Inspect spacing, alignment, typography, optical balance, rhythm, iconography, depth, and motion.

## Output

- Lead with the highest-leverage issue, not encouragement or a long recap.
- Separate observed fact from interpretation.
- For each material issue, name where it occurs, why it matters, and a concrete revision direction.
- Prioritize a short set of changes: **blocking** prevents task completion, safety, or access; **important** materially weakens comprehension, outcome, or system integrity; **polish** improves craft without changing success.
- Name what is working only when it should be protected through revision.
- State evidence confidence when the artifact, target user, product intent, or runtime behavior was not directly inspectable.

Do not score the interface unless a defined rubric and comparison set exist. Do not implement changes unless the user asks for a fix. If evidence is insufficient, say what needs to be inspected or tested.
