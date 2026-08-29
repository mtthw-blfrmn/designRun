# State-model quality bar

Use a transition table when the flow changes durable data, spans async work, can resume, or has meaningful failure and permission states.

For every transition record:

- source state and event;
- guard or precondition;
- actor and authorization;
- system effect and where it persists;
- feedback and announced status;
- destination state;
- retry, cancellation, back, and resume behavior;
- invalidation when upstream data changes.

Separate view state from domain state. Name terminal versus recoverable states. Model duplicate submission, stale data, concurrent edits, expired authorization, partial service failure, and offline behavior when plausible. A loading spinner is not a state model; define what work owns it and what happens on timeout or cancellation.

Use `templates/user-flow.md`. Prefer narrative for a linear sequence, a flow diagram for branching decisions, and a state diagram for lifecycle logic. The transition table remains the testable source when a diagram omits effects or recovery.

