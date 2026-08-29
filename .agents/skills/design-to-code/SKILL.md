---
name: design-to-code
description: Translate an existing supplied or approved design into production interface code with complete states, responsive behavior, and accessibility. Use when asked to implement, port, or match a design in a named codebase. Use product-prototype while direction is still exploratory.
---

# Design to code

Confirm the exact implementation repository and inspect its local instructions before editing. Read the design artifact directly and load the project's brief, approved decisions, design system, accessibility, motion, and content rules that apply.

Read `references/verification.md` before implementation when parity, responsive behavior, or production readiness matters.

## Implement

1. Inventory the design's structure, components, tokens, content, breakpoints, assets, and interactive states.
2. Inspect the target codebase for reusable primitives and conventions before creating new ones.
3. Map design values to semantic tokens. If the design conflicts with the code system, preserve the product intent and name the conflict instead of silently hardcoding around it.
4. Define state ownership, data boundaries, async effects, validation, and event semantics before wiring interactions. Do not create visual state that can diverge from domain state.
5. Implement the smallest coherent slice first, then complete responsive, loading, empty, error, disabled, focus, hover, pressed, success, and reduced-motion behavior as relevant.
6. Preserve semantic HTML, keyboard behavior, accessible names, focus order, and stable layout.
7. Use exact supplied copy and assets unless the user asks for changes. Verify asset provenance and avoid substituting a lookalike icon or image when the source is available.

## Verify

- Build and run the implementation with the repository's own commands.
- Compare rendered output to the source at representative viewport sizes.
- Exercise the primary interaction and important recovery paths.
- Check keyboard navigation, focus visibility, control names, contrast, and reduced motion.
- Inspect console, network failures, hydration, double submission, and async recovery where relevant.
- Report meaningful deviations and their reasons.

Update the project deliverable record with the code path and verification. Do not deploy or publish without explicit authorization.
