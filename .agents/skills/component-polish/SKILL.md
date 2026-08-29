---
name: component-polish
description: Run a focused craft and interaction pass on an already functional component or interface. Use when the user asks to polish, refine, elevate, tune, finish, or improve the feel of an implemented UI without changing its product scope.
---

# Component polish

Polish follows functional correctness. Inspect the rendered component and its source, then read the relevant taste, design-system, accessibility, and motion rules. Do not use polish to disguise unresolved product structure.

Read `references/interface-qa.md` when the pass covers a complete component, responsive behavior, or release readiness.

## Passes

1. **State completeness:** idle, hover, pressed, focus-visible, selected, disabled, loading, success, error, empty, and reduced motion as applicable.
2. **Geometry:** alignment, spacing rhythm, optical centering, target size, hit area, wrapping, and layout stability.
3. **Hierarchy:** typography, contrast, density, borders, radii, and depth. Remove decorative containers that do not communicate structure or behavior.
4. **Response:** press feedback, transition continuity, interruption, async feedback, and perceived latency. Motion must clarify cause and state.
5. **Resilience:** narrow widths, zoom, long labels, localization, missing data, errors, and touch input.
6. **System fit:** semantic tokens, shared primitives, variants, and no screen-local exceptions without a product reason.

Make the changes when implementation is requested, then build and inspect the actual result. Exercise rapid repeat, interrupted async work, long content, keyboard operation, focus return, and narrow reflow where relevant. Inspect console and network failures instead of evaluating the screenshot alone.

Report the few refinements that materially changed usability or feel, the states and viewports verified, and any remaining constraint. If the new behavior could be reusable, mark it only as a promotion candidate.
