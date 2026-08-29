# Accessibility

Accessibility is part of product definition and component quality. The default target is WCAG 2.2 AA; project requirements may be stricter. Record exceptions as defects or approved constraints, not silent design choices.

## Baseline

- Use semantic HTML and native controls before custom behavior.
- Ensure every action has an accessible name and visible keyboard focus.
- Preserve logical reading and tab order.
- Do not use color alone to communicate status or selection.
- Support text resizing and narrow layouts without hiding essential work.
- Announce meaningful async status changes without excessive interruption.
- Give errors a clear cause, location, and recovery path.
- Respect `prefers-reduced-motion` and avoid flashing or disorienting transitions.

## Measurable floor

- Text contrast: at least 4.5:1 for ordinary text and 3:1 for large text under WCAG 1.4.3.
- Non-text contrast: at least 3:1 for information-bearing component boundaries, states, and graphics under WCAG 1.4.11.
- Reflow: essential content and operation must work at 320 CSS px wide or equivalent 400% zoom without two-dimensional scrolling, except content that inherently requires it.
- Target size: meet the WCAG 2.2 AA 24-by-24 CSS px minimum or an allowed spacing/semantic exception; prefer 44-by-44 CSS px for frequent touch actions.
- Focus: a visible indicator must identify the focused control, remain unobscured, and survive sticky headers, dialogs, scrolling containers, and validation movement.
- Timing and animation: never require precise timing where an equivalent untimed path is feasible; provide pause/stop controls when required and preserve meaning under reduced motion.

Use the [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) as the normative checklist rather than memory.

## Complex interaction contract

For dialogs, menus, tabs, comboboxes, grids, drag-and-drop, and custom composites, define role, name, value/state, keyboard commands, entry focus, exit/return focus, reading order, announcements, and pointer-independent alternatives before polishing visuals. Prefer the native element when it already supplies the needed behavior.

## Verification

For meaningful UI changes, verify keyboard navigation, focus return, labels, contrast, zoom/reflow, forced colors, 200% text sizing, 400% browser zoom, touch target behavior, and reduced motion. Add screen-reader checks when semantics, dynamic announcements, validation, or complex widgets change.

Automated checks are a regression net, not conformance evidence. Pair them with manual keyboard and visual inspection and at least one representative screen-reader path for semantic or dynamic UI changes.

Document deliberate exceptions and their mitigation in the project decision log.
