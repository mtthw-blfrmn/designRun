---
name: product-requirements
description: Produce product requirements that connect user outcomes and approved decisions to observable system behavior. Use for PRDs, feature specifications, acceptance criteria, implementation briefs, or turning an explored concept into buildable scope.
---

# Product requirements

Read the project brief, approved decisions, relevant evidence, and the current implementation boundary. Match detail to maturity: early concepts need questions and experiments; committed work needs states and acceptance criteria.

Use `templates/product-requirements.md`. Read `references/technical-prd.md` for engineering handoff, service/data behavior, or release-ready scope. The fictional worked example is `projects/relay-sample/deliverables/outreach-workspace/prd.md`.

## Required structure

1. Problem and intended user outcome
2. Users, actors, permissions, and context
3. Scope now, later, and non-goals
4. Product objects, state ownership, lifecycles, identifiers, and invariants
5. Primary flow plus meaningful alternate, empty, loading, error, recovery, permission, cancellation, resume, concurrent, and terminal states
6. Behavioral requirements written as observable outcomes
7. Content, accessibility, responsive, privacy, security, data, API/event, persistence, performance, resilience, analytics, and motion constraints where relevant
8. Success signals, guardrails, instrumentation, and verification plan
9. Dependencies, risks, assumptions, and open questions

Use stable identifiers for requirements and trace them to acceptance criteria and verification. Define idempotency, validation, authorization, deletion/retention, compatibility, offline/degraded behavior, and failure semantics when the product boundary requires them. Avoid prescribing implementation unless a technical constraint or approved decision requires it. Do not hide unresolved product choices inside acceptance criteria.

Trace requirements to evidence or decisions when the reason is not obvious. Put the artifact in the owning project or implementation repository and link it from `deliverables.md` or the nearest project index.
