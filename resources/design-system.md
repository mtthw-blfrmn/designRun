# Design system

This is the shared execution layer for the workspace. It defines portable decisions; each project may add an explicit theme or constraint without duplicating this file.

## Source relationship

```text
Taste → shared system → project theme and design sources
  → project components → product flows
```

Figma or an implementation may be the concrete visual source for a named project artifact. Shared rules still own semantics, accessibility, motion, and the path for reuse.

## Foundations

- Use semantic names such as `surface`, `text-muted`, `border-strong`, and `action-primary`.
- Keep raw palette and scale values separate from product meaning.
- Components consume semantic tokens rather than raw values.
- Support light, dark, high-contrast, and reduced-motion requirements when the product needs them.
- Make exceptions explicit in the project `decisions.md`.

## Neutral starter tokens

```css
:root {
  --surface-canvas: #ffffff;
  --surface-subtle: #f7f7f6;
  --surface-inverse: #11110f;
  --text-primary: #11110f;
  --text-secondary: #6e6d68;
  --text-inverse: #ffffff;
  --border-subtle: #e8e7e3;
  --border-strong: #11110f;
  --action-primary: #11110f;
  --focus-ring: #11110f;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

These values are a usable neutral baseline, not a universal brand. Change the token maps, not scattered components.

## Token architecture

Use three layers when the system grows beyond the starter map:

1. **Reference tokens** hold raw scales such as neutral color, spacing, type size, radius, duration, and easing.
2. **Semantic tokens** express role and state, such as `surface.default`, `content.muted`, `border.focus`, and `action.danger.hover`.
3. **Component tokens** exist only when a component needs a stable public contract that cannot be expressed by semantic tokens alone.

Aliases must resolve without cycles. A theme changes semantic mappings, not the meaning of token names. Deprecate tokens through an alias-and-migration period; do not silently repurpose them. When interoperating with token tools, prefer the [Design Tokens Community Group format](https://www.designtokens.org/tr/drafts/format/) and keep the serialized source generated from one canonical token definition.

## Component standards

Every reusable interactive component should define:

- Anatomy and content rules
- Default, hover, pressed, focus, disabled, loading, selected, and error states as applicable
- Keyboard behavior and accessible name
- Responsive and overflow behavior
- Motion and reduced-motion behavior
- Test or example coverage for meaningful variants

Treat the component contract as code: document supported composition, controlled/uncontrolled behavior when relevant, state ownership, async behavior, event semantics, and compatibility implications. A visual variant is not a new component unless it changes meaning or interaction.

## Release discipline

- Add regression coverage for state, keyboard, and token changes proportional to risk.
- Treat removed variants, renamed tokens, changed event behavior, and altered default semantics as compatibility changes.
- Keep migration notes with deprecated APIs or tokens.
- Verify all supported themes and representative breakpoints before promotion.

## Iconography

- Hugeicons Stroke Rounded is the default interface icon family. In React, use `@hugeicons/react` with `@hugeicons/core-free-icons` through one app-level wrapper so size, color, and stroke width stay consistent.
- Import only the icons in use. Prefer individual package entry points when the bundler would otherwise scan the full icon catalog.
- Treat icons inside labeled controls as decorative. Give icon-only controls an accessible name and tooltip; never make a critical state legible only by icon shape.
- Keep one visual family within a product surface. Product logos, supplied brand marks, and artifact-specific illustrations are not interface icons and may keep their own geometry.

## Motion

Use motion to show cause, continuity, hierarchy, or system activity. Favor opacity and transforms. Avoid animation that delays work, masks latency, or makes state ambiguous. See `resources/motion.md`.

## Accessibility

Conformance is the floor. Design must remain understandable with keyboard navigation, zoom, high contrast, screen readers, reduced motion, slow networks, and incomplete data. See `resources/accessibility.md`.

## Promotion

Promote a project pattern only when it has survived real use, is relevant beyond the original product, and can be expressed without private data or brand-specific assumptions. Promote the smallest durable unit: a token, anatomy rule, state behavior, motion rule, accessibility requirement, or implementation note.

## Avoid

- Raw color values in feature code
- One-off radius, spacing, shadow, or timing values without rationale
- Components that encode one screen's copy or data model
- Theme overrides that silently change semantics
- A large component catalog built before product work proves the need
