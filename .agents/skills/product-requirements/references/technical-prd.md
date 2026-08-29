# Technical PRD contract

Use this reference when requirements are expected to be implementable, testable, or handed to engineering.

## Object and state model

Name durable product objects, temporary view state, state owners, lifecycle states, identifiers, and invariants. For each material transition, specify trigger, authorization, validation, persisted effect, user feedback, failure effect, retry/resume behavior, and observability. If the same user intent can arrive twice, define idempotency.

## Requirement quality

Each requirement must have a stable ID, one observable outcome, an entry condition or trigger, and a verification method. Avoid “support,” “handle,” “intuitive,” “fast,” or “seamless” without defining behavior or a threshold. Separate product behavior from a proposed component hierarchy.

## System boundary

Record where truth lives; client/server responsibility; authorization; validation; API or event implications; persistence; concurrency; deletion and retention; offline and degraded behavior; version compatibility; migration; and failure semantics. Mark mocked or unwired behavior explicitly.

## Quality attributes

Translate accessibility, privacy, security, performance, localization, responsiveness, content, motion, analytics, and resilience into testable constraints. A generic checklist is not a requirement; include only constraints that shape this product and give them thresholds or observable outcomes.

## Traceability

Connect `evidence/decision → requirement → acceptance criterion → test or observation`. Unknowns that can change scope remain open questions with owners; they must not be smuggled into acceptance criteria as settled behavior.

Use `templates/product-requirements.md`. The worked fictional example is `projects/relay-sample/deliverables/outreach-workspace/prd.md`.

