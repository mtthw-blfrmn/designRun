---
name: "Relay Outreach Workspace PRD"
type: product-requirements
status: sample-approved
version: "1.0"
sample: true
---

# Relay Outreach Workspace PRD

> This is a fictional worked example. Relay, its organizations, users, evidence, metrics, events, and technical interfaces are synthetic. The structure is intended to be copied; the feature is not.

## Document control

| Field | Value |
| --- | --- |
| Owner | Sample product team |
| Decision status | Approved for worked example |
| Product context | `../../brief.md` |
| Evidence | `../../research.md` |
| Decisions | `../../decisions.md` |
| Flow | `user-flow.md` |
| Implementation | Not assigned |

## Problem

Volunteer coordinators assemble outreach campaigns across disconnected files and tools. They cannot reliably see how mapping, validation, consent, exclusion, and message changes alter the final audience. This makes the authorization boundary ambiguous and failures difficult to audit.

## Outcome

A permitted coordinator can import a contact file, resolve or explicitly exclude blocking records, compose one message, review the exact audience and content snapshot, and create one simulated send run that remains explainable after submission.

## Evidence and decision traceability

| Source | What it supports | Limitation |
| --- | --- | --- |
| R-01 | Persistent included, excluded, and unresolved counts | Synthetic walkthroughs do not establish prevalence |
| R-02 | Rule-level issues with row and consequence detail | Error fixtures were constructed |
| R-03 | Immutable review and submission snapshot | No real provider integration was observed |
| D-01 | Revision, audience snapshot, checksum, and idempotent submission | Sample decision only |
| D-02 | Recompute audience impact after dependency changes | Requires usability validation |

## Actors and permissions

| Actor | Required capability | Can | Cannot |
| --- | --- | --- | --- |
| Coordinator | `campaign:create` | Create and edit drafts; submit a simulated send | Change organization consent policy |
| Reviewer | `campaign:review` | Inspect draft, issues, audience, and preview | Edit or submit unless separately permitted |
| Organization owner | `organization:admin` | Manage members, sender identities, and policy | Modify an immutable send run |
| Delivery adapter | Service credential | Accept a frozen run and append delivery events | Read unrelated organization data |

Permission is evaluated on load and again at submission. Losing write permission preserves a readable draft and explains the changed capability.

## Scope

### In scope

- CSV upload up to the configured row and byte limit.
- Header detection and explicit mapping for name, destination, and consent fields.
- Deterministic validation with blocking and warning severity.
- Row exclusion and one-level undo before submission.
- One plain-text message with channel-aware length validation.
- Review of audience counts, exclusions, sender, message, and snapshot revision.
- Idempotent simulated send creation and delivery/reply event display.
- Saved draft recovery, keyboard operation, reflow, reduced motion, and failure recovery.

### Later

- Inline editing of imported contact values.
- Shared approval, scheduling, recurring campaigns, and multiple channels.
- Production sender and delivery-provider integrations.
- Template libraries, automated reply classification, and exports.

### Non-goals

- CRM, contact acquisition, inferred consent, autonomous sending, journey automation, billing, or fundraising.

## Product objects

| Object | Stable identity | Mutable states | Owner | Retention and sensitivity |
| --- | --- | --- | --- | --- |
| Campaign draft | `draft_id` UUID | editing, validating, reviewable, archived | Organization | Contains message and references to contact import |
| Draft revision | `revision_id` UUID | immutable after creation | Campaign draft | Retain with draft audit history |
| Import attempt | `import_id` UUID | queued, parsing, mapped, validated, failed, replaced | Draft revision | May contain personal data; delete by policy |
| Validation issue | `issue_id` stable hash of rule and row | open, resolved, excluded, superseded | Import attempt | Stores minimal rule and field evidence |
| Audience snapshot | `audience_id` UUID | immutable | Draft revision | Contains exact recipient record IDs and exclusion reasons |
| Message revision | `message_id` UUID | draft, frozen | Draft revision | Plain text plus checksum |
| Send run | `run_id` UUID | submitting, accepted, partial, complete, failed | Organization | Immutable authorization and result record |
| Delivery event | Provider event ID | accepted, delivered, failed, replied | Send run recipient | Append-only; payload minimized |

## State invariants

- A draft has at most one current revision; prior revisions remain inspectable.
- A reviewable revision has zero blocking issues and exactly one audience snapshot and message revision.
- `included + excluded + unresolved = normalized source rows` for a given validation result.
- A send run references immutable `revision_id`, `audience_id`, and `message_id` values.
- The same organization and idempotency key cannot create two send runs.
- Delivery events never mutate the authorized audience or message.

## Primary flow

1. Coordinator creates a draft and selects a CSV.
2. The system parses headers and presents proposed field mappings.
3. Coordinator confirms mappings; validation produces issue groups and audience counts.
4. Coordinator fixes supported issues or explicitly excludes affected rows.
5. Coordinator writes a message and inspects a representative preview.
6. Review freezes a draft revision, audience snapshot, and message checksum.
7. Coordinator authorizes the simulated send.
8. The system creates one send run and appends delivery and reply events.

Detailed transitions, invalidation, retry, and resume behavior live in `user-flow.md`.

## Functional requirements

### Import and mapping

- **IMP-001:** The product must reject unsupported type, unreadable encoding, configured byte-limit, and configured row-limit failures before mapping, without losing the existing saved draft.
- **IMP-002:** The mapping surface must show the source header, representative values, destination field, confidence when inferred, and required/optional status.
- **IMP-003:** Name, destination, and consent destination fields must each map from at most one source column; destination and consent are required.
- **IMP-004:** Confirming a changed mapping must identify which corrections and review artifacts will be invalidated before applying the change.
- **IMP-005:** Canceling import must terminate client upload work when possible and leave the prior saved revision intact.

### Validation and correction

- **VAL-001:** Each rule must return a stable code, severity, affected row identifiers, field, human-readable cause, inclusion consequence, and supported resolution actions.
- **VAL-002:** Blocking rules include missing or invalid destination, missing consent evidence, duplicate destination with conflicting consent, and organization suppression.
- **VAL-003:** Warnings may be acknowledged only when they do not violate organization policy.
- **VAL-004:** Included, excluded, and unresolved counts must recompute from the same validation result and remain visible through correction.
- **VAL-005:** Excluding a row must record actor, timestamp, issue code, and optional reason; undo is available until review is frozen.
- **VAL-006:** Replacing the source file creates a new import attempt and supersedes, rather than mutates, the old validation result.

### Message and preview

- **MSG-001:** The message must be non-empty after normalization and must satisfy configured channel length and prohibited-content rules.
- **MSG-002:** Preview must label variable substitutions, missing fallback values, sender identity, and that the render is simulated when it is not provider-authentic.
- **MSG-003:** Editing the message after review invalidates the previous message checksum and review snapshot, not the audience corrections.

### Review and submission

- **REV-001:** Review must show source filename and import revision, included/excluded/unresolved counts, sender, exact normalized message, unresolved warnings, and snapshot timestamp.
- **REV-002:** Submission is disabled if the current draft differs from the reviewed revision, any blocking issue is open, permission is missing, or sender policy is invalid.
- **REV-003:** The client generates one idempotency key per deliberate submit attempt and reuses it until a definitive response is received.
- **REV-004:** If submission result is unknown, the product queries by idempotency key before enabling another submit.
- **REV-005:** Success exposes run ID, authorized recipient count, excluded count, message checksum, actor, and time.

### Results and replies

- **RUN-001:** Delivery events are append-only and deduplicated by provider event ID.
- **RUN-002:** Aggregates must reconcile to recipient-level terminal and non-terminal states; “sent,” “delivered,” and “replied” are never interchangeable.
- **RUN-003:** A failed recipient displays normalized reason and retry eligibility without changing the original send run.
- **RUN-004:** Replies preserve sender, recipient, received time, original run, and unread state; automated interpretation is out of scope.

## Validation rule contract

```json
{
  "ruleCode": "consent.missing_evidence",
  "severity": "blocking",
  "rowId": "row_00042",
  "field": "consent",
  "message": "Consent evidence is required before this contact can be included.",
  "effect": "excluded_until_resolved",
  "actions": ["exclude", "replace_source"],
  "ruleVersion": "2026-08-01"
}
```

Rule codes and effects are API contracts. Display copy may change without changing analytics or audit identity.

## API implications

### Create import

`POST /v1/campaign-drafts/{draft_id}/imports`

- Requires draft write permission and current `revision_id` precondition.
- Returns a short-lived upload target and `import_id`.
- Rejects stale revisions with `409 revision_conflict`.

### Confirm mapping

`PUT /v1/imports/{import_id}/mapping`

- Body contains explicit source-to-destination mappings and mapping schema version.
- Uses `If-Match` or equivalent revision precondition.
- Returns validation job identity; repeated identical requests are idempotent.

### Create send run

`POST /v1/send-runs`

```json
{
  "draftId": "draft_…",
  "revisionId": "rev_…",
  "audienceId": "aud_…",
  "messageId": "msg_…",
  "senderId": "sender_…",
  "idempotencyKey": "0191…"
}
```

- Server revalidates permission, sender policy, snapshot ownership, blocking issue count, and revision freshness.
- Returns the existing run for a repeated idempotency key with the same payload.
- Returns `409 idempotency_mismatch` when the same key is reused with different input.
- A timeout is an unknown result, not a failed send; clients reconcile before retry.

## Concurrency and persistence

- Draft updates use revision preconditions. A stale writer receives the latest revision metadata and must reconcile instead of overwriting.
- Client autosave is debounced, exposes saving/saved/error state, and never presents browser storage as server persistence.
- Background validation results are applied only when their `import_id` and mapping revision still match the current draft.
- Submission locks the reviewed revision logically; it does not block a user from branching a new editable revision.

## Privacy and security

- Classify destination, name, consent evidence, delivery status, and reply content as personal data.
- Store raw import files separately from normalized contact records with an explicit retention job.
- Encrypt data in transit and at rest; redact personal fields from application logs and analytics.
- Enforce organization scope on every object lookup, not only on route entry.
- Record actor, permission decision, draft revision, audience snapshot, message checksum, idempotency key, and result for submission audit.
- Do not use recipient content for model training or secondary processing without a separately authorized policy.

## Accessibility requirements

- **A11Y-001:** The workflow must conform to WCAG 2.2 AA for applicable criteria.
- **A11Y-002:** File selection uses a labeled native input or equivalent keyboard-operable control; drag-and-drop is supplementary.
- **A11Y-003:** Mapping is not conveyed by connector lines alone. Source, destination, required state, and error are available in text and programmatic relationships.
- **A11Y-004:** Validation completion and count changes use polite status announcements; focus remains on the triggering control unless an error blocks progress.
- **A11Y-005:** Issue summaries link to the affected control or row, and focus return is deterministic after resolution.
- **A11Y-006:** Virtualized tables preserve header associations, row position, keyboard navigation, and non-virtualized access for assistive technology when required.
- **A11Y-007:** At 320 CSS px width or 400% zoom, required actions and issue details reflow without two-dimensional scrolling except the data table itself.
- **A11Y-008:** Reduced motion removes spatial transitions without removing progress or state communication.

## Responsive and resilience requirements

- Preserve the current step, audience counts, and primary action at narrow widths; move supporting data into disclosure rather than hiding it.
- Long headers, international names, 200% text size, empty optional values, and 10× expected issue counts must not overlap or obscure actions.
- The data table may scroll horizontally inside a labeled region; the page itself must not require horizontal scrolling at 320 CSS px.
- Offline or transient network loss preserves the last confirmed server revision and labels unsaved input.

## Performance budgets

Budgets are hypotheses until implementation architecture is known:

- Visible upload acknowledgment within 100 ms of user action.
- First mapping surface within 1 second after a small fixture upload completes.
- Validation progress appears within 400 ms when completion will exceed 1 second.
- Row filtering and correction feedback remain within 100 ms at the supported client row count.
- No layout shift moves the primary action after it becomes operable.

Implementation must record test fixture sizes, device/browser profile, percentile, and measured result rather than claiming these budgets without measurement.

## Analytics and operational signals

| Event | Trigger | Required properties | Guardrail |
| --- | --- | --- | --- |
| `import_completed` | Parser produces a mappable file | draft, import, row_count, column_count, duration_ms | No raw headers or contact values |
| `validation_completed` | Matching validation job completes | import, rule_version, included_count, excluded_count, unresolved_count, duration_ms | Counts only |
| `issue_resolution_applied` | User fixes or excludes | issue_code, action, affected_count | No row content |
| `review_opened` | Current revision becomes reviewable | revision, audience_count, warning_count | Message checksum, not message body |
| `send_submitted` | Server accepts the idempotent request | run, revision, audience_count, actor_role | Audit event; no recipient values |

Success analysis requires denominators: eligible drafts reaching each stage, not raw event totals. Synthetic sample targets are intentionally omitted.

## Error and recovery matrix

| Failure | User-visible state | Preserve | Recovery |
| --- | --- | --- | --- |
| Unsupported file | Exact type/encoding reason before mapping | Existing saved draft | Choose another file |
| Parse timeout | Import attempt with diagnostic ID | Source reference and prior draft | Retry or replace |
| Validation service unavailable | Stale-safe paused state | Mapping and prior result labeled stale | Retry matching revision |
| Revision conflict | Conflict notice with changed areas | Local unsaved input | Compare, reload, or branch |
| Permission revoked | Read-only draft | Saved data | Ask owner; export only if policy permits |
| Submit timeout | Unknown submission state | Frozen snapshot and idempotency key | Reconcile status before retry |
| Partial provider failure | Run with recipient-level outcomes | Immutable audience and events | Create follow-up draft for eligible failures |

## Acceptance criteria

- **AC-001 / IMP-003:** Given a CSV whose destination field is unmapped, when mapping is confirmed, then validation does not start and focus moves to an exact mapping error.
- **AC-002 / VAL-004:** Given 100 normalized rows, when 7 are excluded and 3 remain blocking, then counts show 90 included, 7 excluded, and 3 unresolved and the accessible status communicates the change.
- **AC-003 / IMP-004:** Given completed row exclusions, when the destination mapping changes, then the product names the corrections that will be invalidated and applies no reset until confirmation.
- **AC-004 / REV-002:** Given a reviewed revision, when the message changes, then submission disables and identifies that review must be refreshed.
- **AC-005 / REV-003:** Given two identical requests with the same idempotency key, when the server accepts both, then exactly one send run exists and both responses identify it.
- **AC-006 / REV-004:** Given a client timeout after submit, when the user reconnects, then the product queries the existing key and does not offer a second send until status is known.
- **AC-007 / A11Y-004:** Given keyboard-only operation, when validation completes, then counts and status are announced without moving focus away from the initiating context.
- **AC-008 / RUN-002:** Given recipient events with accepted, delivered, failed, and replied states, then aggregate totals reconcile to unique run recipients using documented state precedence.
- **AC-009 / privacy:** Given analytics and application logs from the primary flow, then no contact destination, name, message body, or reply body is present.
- **AC-010 / resilience:** Given refresh after a successful autosave, then the same server revision opens with no false unsaved indicator.

## Verification plan

### Contract tests

- Idempotency equality and mismatch behavior.
- Revision conflict and organization-scope enforcement.
- Validation-rule schema and count invariant.
- Delivery-event deduplication and aggregate reconciliation.
- Retention job and audit event redaction.

### Interaction tests

- Import cancel, replace, retry, mapping invalidation, correction undo, and stale-result suppression.
- Review invalidation after audience, sender, or message change.
- Unknown submission recovery and partial delivery results.
- Empty, loading, error, permission-loss, offline, and resumed-draft paths.

### Accessibility tests

- Keyboard completion and deterministic focus return.
- Screen-reader mapping, issue summary, async status, and table semantics.
- Contrast, target size, 200% text, 400% zoom/reflow, high contrast, reduced motion.

### Performance tests

- Small, median, and maximum supported fixtures with recorded hardware/browser profile.
- Input response during issue filtering and correction.
- Validation cancellation and stale-job suppression under network delay.

## Release gates

- All blocking requirements and acceptance criteria trace to passing evidence.
- Security review confirms organization scoping, log redaction, retention, and audit behavior.
- Accessibility verification covers the complete import-to-confirmation path.
- Product review approves content and destructive-reset language.
- Operations can reconcile unknown and partial submission states.
- No external send is enabled until provider behavior and authorization are separately approved.

## Open questions

- Is inline correction necessary for the first release, or should users replace the source file?
- Which consent provenance values satisfy organization policy?
- What is the maximum supported row count for synchronous interaction?
- Does shared approval introduce a separate review object and signature?
- Which provider state model defines terminal delivery and reply precedence?
