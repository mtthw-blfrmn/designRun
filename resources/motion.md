# Motion

Motion should explain what changed, where an object came from, or what the system is doing.

## Rules

- Start with the state transition, not an animation technique.
- Prefer opacity and transform for performance and spatial continuity.
- Never use `transition: all`; enumerate the properties whose interpolation is intended.
- Keep frequent interactions fast and calm; longer motion must earn its duration.
- Define durations and easing as tokens when they recur.
- Preserve stable dimensions for changing text, counters, and loading states.
- Provide a reduced-motion path that preserves meaning.
- Verify interruption, rapid repeat, and exit behavior—not only the happy path.

## Transition contract

For material motion, specify:

- trigger and source state
- destination state and the invariant that remains understandable during motion
- animated properties, duration, delay, and easing token
- interruption and reversal behavior
- focus and input behavior while moving
- loading or async ownership when the destination is not ready
- reduced-motion behavior

Favor compositor-friendly `transform` and `opacity`, but do not force them when the visual model requires another property. Profile repeated or large-surface motion on representative hardware. Treat dropped frames, layout shift, input blocking, and delayed focus as defects.

## Starter values

```css
:root {
  --duration-fast: 120ms;
  --duration-standard: 200ms;
  --duration-deliberate: 320ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

Tune these values in context. Do not describe motion only as “smooth” or “premium.”

Under `prefers-reduced-motion: reduce`, remove nonessential travel and parallax, shorten or eliminate ornamental transitions, and retain immediate state feedback. Reduced motion is not reduced information.

## Implementation tools

- Use CSS transitions and keyframes for small, self-contained effects whose ownership and interruption behavior remain obvious.
- Use Motion for React when React state needs enter/exit behavior, layout continuity, gestures, reordering, or interruptible animation.
- Use ReactBits as a pattern reference when exploring a reusable treatment, then translate the useful behavior into local tokens and components.
- See `resources/tools.md` for current links, setup, constraints, and verification guidance. A tool supports this motion contract; it does not replace it.

## Control-center implementation

The included control center uses a restrained, high-damping motion model:

- frequent control feedback completes in 120ms;
- view and state changes complete in 200ms with no overshoot;
- the mobile navigation sheet uses 320ms only because it preserves spatial origin;
- view changes travel no more than 5px, cards lift no more than 2px, and pressed controls compress by no more than 4%;
- dialogs enter from their trigger context, keep focus inside while open, reverse more quickly on exit, and return focus to the trigger;
- loading and refresh indicators animate only while work is owned by that control;
- theme changes interpolate surfaces, borders, and ink while layout remains fixed.

The CSS implementation in `app/app/globals.css` centralizes durations and easing as `--motion-*` and `--ease-*` tokens. Its reduced-motion query compresses transitions and animations to an effectively immediate state change, including infinite indicators.
