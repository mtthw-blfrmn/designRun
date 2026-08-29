---
name: pattern-promotion
description: Review a project-specific solution and, when justified, turn its reusable core into a shared designRun pattern or standard. Use when the user asks to promote, generalize, standardize, reuse, or move a proven prototype pattern into shared context.
---

# Pattern promotion

Promotion is a review, not a file move. Read the source artifact, project evidence, decisions, verification, and any similar existing pattern.

## Gate

Promote only when:

- the underlying problem recurs beyond one screen or project
- the solution has been evaluated in realistic use
- known states, accessibility behavior, content, and implementation constraints are understood
- the benefit is not merely brand preference or prototype convenience
- the abstraction is clearer than repeating the solution locally

If evidence is weak, leave a named candidate and specify what must be learned.

## Generalize

1. State the recurring problem and when the pattern applies.
2. Separate the invariant principle from project copy, data, layout, technology, and brand.
3. Document anatomy, behavior, state matrix, accessibility, content, motion, responsive rules, and failure modes as relevant.
4. Add examples and non-examples, including when not to use it.
5. Name the source projects and evidence without carrying confidential details.
6. Compare with existing shared guidance; update one canonical source instead of creating a duplicate.

## Compatibility gate

- Identify current consumers and whether the promoted API, token, behavior, or content contract changes them.
- Define fixtures or examples that demonstrate every supported state and theme.
- Add regression checks for semantics, keyboard behavior, tokens, responsive behavior, and events proportional to risk.
- Use deprecation plus migration guidance for removed names or behavior; never repurpose an existing semantic token silently.
- Give the pattern a version or changelog entry when independent consumers need to coordinate adoption.

Use `templates/pattern.md` for a standalone pattern. Link back to the originating artifact and record any project decisions affected.
