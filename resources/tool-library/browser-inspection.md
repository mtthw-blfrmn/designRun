---
name: Browser inspection
order: 5
category: Verification
official_url: https://playwright.dev/docs/locators
last_verified: 2026-08-28
---

# Browser inspection

Browser inspection is the live evidence surface for coded product behavior. It lets an agent verify what users can actually see and do, including responsive layout, semantics, focus, console output, network behavior, and transition states.

## Use when

- Rendered geometry, interaction behavior, accessibility, responsive layout, or runtime state matters.
- A local product or prototype can be run and inspected directly.
- Source review alone cannot establish whether the experience works.

## Do not use when

- A purpose-built API or connector is the safer, more precise way to perform a semantic external operation.
- Browser automation would mutate an external service beyond the user's explicit request.
- Authentication is missing and substituting a different account or surface would change scope.

## Agent instructions

1. Identify the exact product, start command, URL, route, viewport, data state, and user role. Do not inspect the wrong local server because it is already running.
2. Read the browser capability instructions for the active harness. Prefer a supported browser surface with existing project access; state material limitations when direct inspection is unavailable.
3. Start from a clean, reproducible route. Capture existing console errors and failed requests before interacting so new failures are distinguishable from baseline noise.
4. Use user-facing semantics to interact: role, accessible name, label, text, and explicit test contracts. Avoid brittle coordinates or DOM traversal unless the interface exposes no semantic path.
5. Exercise the complete relevant flow, not only the annotated element. Include entry, success, cancellation, recovery, and back navigation where they can change the conclusion.
6. Inspect loading, empty, error, partial, permission, offline, interruption, and long-content states. Change viewport dimensions to representative narrow, medium, and wide layouts.
7. Test keyboard order, visible focus, escape behavior, focus return, modal containment, accessible names, headings, live status, and reduced motion. Semantic locators are early evidence, not a complete accessibility audit.
8. Watch console, network, and runtime errors during every changed state. Preserve a trace or focused screenshot when it materially supports a decision or regression.
9. Compare observed behavior with the project brief, design source, and implementation. Fix source-owned defects in source; do not use browser-only overrides as the implementation.
10. Re-run the exact failed path after changes and a nearby regression path. Record remaining environmental uncertainty.

## Verification

- Confirm all primary actions work through mouse or touch and keyboard.
- Inspect representative viewport sizes, zoom, long strings, and theme states.
- Verify no unexpected console errors, failed requests, hydration warnings, or focus loss occur.
- Test reduced-motion behavior and rapid repeated input during transitions.
- Use visual comparison only in a stable environment and review diffs rather than updating baselines blindly.
- Where risk warrants it, pair browser checks with automated tests, accessibility scanning, and a production build.

## Constraints

- A screenshot cannot prove interaction correctness; source cannot prove rendered correctness.
- Semantic locators do not replace a WCAG review or assistive-technology testing.
- Browser state can contain private data. Do not inspect cookies, passwords, storage, or unrelated sessions.
- Coordinate-based automation is a last resort and must not become a false assertion of accessibility.

## Official references

- [Playwright locators](https://playwright.dev/docs/locators)
- [Accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Visual comparisons](https://playwright.dev/docs/test-snapshots)

