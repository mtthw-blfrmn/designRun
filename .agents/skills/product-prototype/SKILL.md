---
name: product-prototype
description: Design and build a working product prototype from a brief, decision, flow, or product question. Use when the user asks to explore, prototype, mock up, make interactive, or try a product direction before a final supplied design exists. Do not use merely to reproduce an already approved design in production code.
---

# Product prototype

A prototype is an instrument for learning. Make it realistic enough to answer the named product or design question, and no broader than the evidence justifies.

Read `references/test-contract.md` before building a testable prototype or simulating system behavior.

## Frame the experiment

1. Read the project brief, approved decisions, relevant research, Taste, and shared system rules. Inspect named references and existing product behavior directly.
2. State the question the prototype must answer, the user and situation, the critical transition, and what observation would change the direction.
3. Choose the lowest fidelity that can produce that observation:
   - narrative or state model for object and policy uncertainty
   - wireflow for sequence and information uncertainty
   - coded interaction for behavior, responsive, motion, or product-feel uncertainty
   - high-fidelity screen only when visual hierarchy or market expression is the question
4. Confirm the owning project and implementation location. Use an existing prototype or product repository when recorded; do not invent a new publishing target. For a new maintained artifact, create `projects/<project>/deliverables/<slug>/` from `templates/deliverable/` or run `npm run new:deliverable -- <project-slug> "<Deliverable name>"`.

## Build the coherent slice

- Preserve the product's important objects and real language. Avoid generic dashboard filler.
- Make the primary path complete enough to experience from entry to outcome.
- Include only the alternate, empty, loading, permission, error, recovery, responsive, keyboard, and reduced-motion states that can affect the question being tested.
- Reuse system tokens and existing components when the prototype is meant to test the product direction. Diverge deliberately when the experiment is testing the system itself.
- Use realistic but safe sample data. Do not place private customer data, credentials, or licensed material in a redistributable prototype.
- Keep irreversible, networked, or production mutations simulated unless the user explicitly authorizes a real integration.
- Label simulation boundaries in both the artifact and notes. A fake success must not imply that data was sent, persisted, purchased, published, or authorized.

## Verify and record

Run the prototype in its actual medium. Exercise the critical path, inspect representative widths, and check visible focus, semantics, control names, layout stability, and reduced motion as relevant. If a browser or visual tool is unavailable, run the strongest available checks and state the gap.

Update `prototype-notes.md` with:

- artifact path and how to run it
- question and fidelity
- behavior and states included
- what was verified
- observations or evidence still needed
- promotion candidates, clearly marked as unproven

Link a maintained prototype from `deliverables.md`. Do not call a concept production-ready, promote its patterns, or publish it without the corresponding evidence and authorization.
