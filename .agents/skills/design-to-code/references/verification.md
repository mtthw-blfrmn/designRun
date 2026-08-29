# Design-to-code verification

## Source map

Before implementation, map each source region to the target component, semantic token, asset, content source, and interaction/state owner. Record intentional deviations. Do not infer unavailable responsive or interaction states as if they were supplied.

## Render matrix

Inspect at minimum:

- each supplied breakpoint plus narrow and wide stress widths;
- default, hover, focus-visible, pressed, disabled, loading, empty, validation, error, success, and reduced-motion states that apply;
- short, long, missing, localized, and user-generated content where plausible;
- supported themes and forced colors when relevant.

## Behavior checks

Exercise keyboard order, focus entry/return, accessible names, announcements, pointer-independent operation, cancellation, retry, async races, double submission, and back/resume behavior. Check console, failed network requests, hydration warnings, layout shifts, and stale loading state.

## Visual comparison

Compare at identical viewport dimensions and content. Check macro geometry first, then type metrics, wrapping, spacing, borders, radii, depth, icons, and motion. An overlay or image diff can locate deviation, but use judgment for font rendering and dynamic content.

## Handoff evidence

Report commands run, paths changed, states exercised, representative viewports, automated and manual accessibility checks, unresolved deviations, and the reason for every source mismatch. Never claim pixel parity without a rendered comparison.

