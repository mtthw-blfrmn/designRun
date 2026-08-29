---
name: Motion for React
order: 1
category: Motion
official_url: https://motion.dev/docs/react
last_verified: 2026-08-28
---

# Motion for React

Use Motion when a React interface needs interruptible, state-driven motion, coordinated entry and exit, gesture feedback, or layout continuity that CSS alone cannot express cleanly. The package is `motion`; React APIs come from `motion/react`.

## Use when

- Elements enter or leave the React tree and need coordinated exit behavior.
- Position, size, order, or shared-element continuity changes across states.
- Tap, drag, hover, focus, or scroll behavior needs cross-input gesture handling.
- Animation must follow live React state, remain interruptible, or use spring physics.

## Do not use when

- A direct CSS transition on color, opacity, or transform fully explains the change.
- Motion is decorative, repetitive, or delays access to the next state.
- The implementation cannot provide a useful reduced-motion path.

## Agent instructions

1. Read `resources/motion.md`, the active project brief, and relevant accessibility rules before choosing an API.
2. Describe the state change in plain language: what changed, where the object came from, and what needs continuity. Do not begin with an animation preset.
3. Inspect the current package manifest and official docs before installing. If needed, run `npm install motion` in the owning application only, then import from `motion/react`.
4. Prefer transforms and opacity for frequent animation. Use `layout` for measured layout changes, `layoutId` only for genuine shared identity, and `AnimatePresence` when removed elements need an exit state.
5. Derive duration, easing, stiffness, damping, and distance from project motion tokens. Keep transition choices centralized instead of scattering arbitrary values through components.
6. Keep the semantic state in React; animation values should express that state, not become a second source of truth. Stable keys must represent stable identity.
7. Use hover only as enhancement. Pair pointer feedback with focus and press behavior where the interaction requires it.
8. Implement reduced motion with `MotionConfig`, `useReducedMotion`, or an equivalent project abstraction. Preserve state clarity even when travel, scale, parallax, and complex transforms are removed.
9. Test interruption: reverse the transition, activate it repeatedly, resize during it, and trigger the next action before the prior animation settles.
10. Record any new reusable motion decision in the project first. Promote it to shared motion guidance only after it succeeds in more than one context.

## Verification

- Test enter, steady, exit, interrupted, rapid-repeat, and reordered states.
- Verify keyboard focus never lands on an exiting or inert element.
- Check touch, mouse, and keyboard input; do not infer touch behavior from hover.
- Enable the operating system's reduced-motion setting and confirm the result remains understandable.
- Inspect representative low-power and mobile devices for dropped frames and layout thrashing.
- Confirm server rendering and hydration do not flash an unintended initial state.

## Constraints

- A motion library does not authorize excessive motion or override the project's accessibility contract.
- Avoid animating layout-affecting properties continuously when a transform can communicate the same change.
- Do not use a long exit to block navigation or data updates.
- Check the installed Motion version before relying on a newly documented API.

## Official references

- [Motion for React](https://motion.dev/docs/react)
- [Layout animation](https://motion.dev/docs/react-layout-animations)
- [Gestures](https://motion.dev/docs/react-gestures)
- [Reduced motion](https://motion.dev/docs/react-use-reduced-motion)

