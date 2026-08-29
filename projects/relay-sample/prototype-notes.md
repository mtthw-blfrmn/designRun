# Relay Sample prototype notes

## Prototype inventory

| Artifact | Question tested | Fidelity | Status | Link or path |
| --- | --- | --- | --- | --- |
| Outreach state model | Can draft invalidation and send immutability be understood without screens? | State and transition model | Complete sample | `deliverables/outreach-workspace/user-flow.md` |

## Observations

- The review boundary must expose draft revision and audience impact even if those identifiers remain visually quiet.
- Mapping edits can invalidate correction work; the interface needs a preview of that consequence before destructive reset.
- A recoverable draft is a product state, not merely browser persistence.

## Next experiments

- Test inline row correction against source-file replacement with realistic but synthetic error sets.
- Prototype focus movement and status announcements after mapping changes recompute validation.

## Promotion candidates

- Immutable review snapshot with a visible revision delta.
- Dependency-aware reset warning that names exactly which later work will be invalidated.
