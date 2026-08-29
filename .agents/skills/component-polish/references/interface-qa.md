# Interface QA matrix

## Geometry and resilience

Inspect supported widths, 200% text, 400% zoom/reflow, long and missing content, localization expansion, safe areas, virtual keyboards, pointer and touch targets, overflow, scroll containment, and layout shift.

## State and input

Verify idle, hover where supported, focus-visible, pressed, selected, disabled, loading, success, warning, error, empty, read-only, skeleton, drag, and reduced-motion states that apply. Exercise keyboard, pointer, touch, and assistive semantics. Rapid repeat and interrupted async work must not leave impossible state.

## Visual system

Check semantic-token use, type metrics, optical alignment, spacing rhythm, icon family/stroke, border and radius consistency, theme contrast, forced colors, and focus visibility. Remove surfaces whose only purpose is decoration.

## Runtime evidence

Inspect the rendered interface, console, failed requests, hydration, responsive transitions, and representative slow/loading behavior. Build and test with the repository’s commands. Capture before/after only when it materially helps review; do not substitute screenshots for interaction checks.
