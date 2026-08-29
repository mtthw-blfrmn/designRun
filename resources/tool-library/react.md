---
name: React
order: 7
category: Interface architecture
official_url: https://react.dev/learn
last_verified: 2026-08-28
---

# React

React is the default component model for stateful coded product prototypes in this template. Use it to express interface state, data ownership, composition, and interaction boundaries that can be tested and evolved.

## Use when

- The work includes a stateful flow, builder, editor, workbench, reusable component, or interactive prototype.
- A coded experience will resolve product questions that static frames cannot.
- The implementation may inform or become production code.

## Do not use when

- A static artifact or simpler platform answers the question faster and more clearly.
- Adding React would create a second application inside an existing product stack.
- The artifact is deliberately disposable and has no meaningful state or reuse.

## Agent instructions

1. Inspect the owning application's React version, framework, routing, data layer, component system, and conventions before creating files or installing packages.
2. Model the user-visible states first. Use explicit state names or discriminated unions for loading, empty, success, error, permission, and destructive confirmation rather than combinations of loosely related booleans.
3. Give each piece of state one owner. Derive values during render when possible; avoid redundant, duplicated, contradictory, or deeply nested state.
4. Keep reusable primitives separate from project-specific composition. A component boundary should represent a stable responsibility, not merely shorten a file.
5. Prefer semantic HTML and native behavior. Add ARIA only when native semantics cannot express the interface, and preserve keyboard and focus behavior through state changes.
6. Treat Effects as synchronization with external systems, not as a general mechanism for derived state or event handling. Clean up subscriptions, timers, observers, and requests.
7. Keep content and interaction contracts explicit in props. Avoid hidden global dependencies and overly broad context providers.
8. Use stable identity for list keys and component preservation. Reset state intentionally when product context changes; do not rely on accidental remounting.
9. Implement the complete state model with representative data, including long labels, missing values, slow responses, and errors.
10. Preserve repository boundaries. Do not invent a parallel component library when the existing application has one.

## Verification

- Exercise every modeled state and state transition, including cancellation and retry.
- Verify keyboard behavior, focus continuity, accessible names, semantic structure, and live updates.
- Test cleanup by navigating away, remounting, interrupting requests, and repeating interactions rapidly.
- Run typecheck, lint, focused tests, and the production build.
- Inspect the rendered result in a browser at representative widths and content extremes.
- Confirm components do not duplicate source-of-truth data or create impossible state combinations.

## Constraints

- React is a rendering and composition model, not a design system, data model, or accessibility guarantee.
- Do not add state simply to trigger presentation when CSS or derived rendering is sufficient.
- Avoid premature abstractions; promote a component only when its contract is understood.
- Check current official documentation for version-sensitive APIs and framework-specific server/client boundaries.

## Official references

- [React Learn](https://react.dev/learn)
- [Managing state](https://react.dev/learn/managing-state)
- [Choosing state structure](https://react.dev/learn/choosing-the-state-structure)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)

