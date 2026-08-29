---
name: workspace-audit
description: Inspect designRun for structural integrity, stale or conflicting sources, orphaned project artifacts, duplicate ownership, privacy risk, and unpromoted learnings. Use when the user asks to audit, clean up, validate, organize, review health, or diagnose drift in the workspace.
---

# Workspace audit

An audit is read-only unless the user also asks for fixes.

## Inspect

1. Run `npm run validate` and report structural failures first.
2. Check that every project has a current brief, decisions, research provenance, implementation boundaries, and relevant nested instructions.
3. Check project artifacts for valid ownership, linked evidence, verification, and durable decisions in canonical project files.
4. Find contradictory, duplicated, stale, or uncited shared guidance. Use source precedence; do not blend conflicts silently.
5. Review pattern candidates for sufficient evidence and existing patterns for known states, accessibility, and use boundaries.
6. Check skills for overlapping triggers, missing workflow steps, excessive context loading, and outdated tool assumptions.
7. Flag secrets, personal data, customer-confidential content, licensed assets, generated indexes committed as truth, and external publishing ambiguity.
8. For readiness or release audits, test the pristine-user path: clean install, validation, project creation, indexing, local app startup, source read/write conflicts, private-path rejection, and the documented harness fallback.
9. Compare the control center to the canonical source model: every first-class area should be discoverable, agent edits should synchronize, empty and failure states should explain recovery, and browser-only capabilities must not be presented as universal harness behavior.
10. Inspect dependency and supply-chain health with the repository’s lockfile, audit tooling, engine constraints, license declarations, generated-file policy, CI parity, and clean build. Do not apply forced dependency upgrades during a read-only audit.

## Report

Order findings by impact: integrity or privacy risk, product-context drift, broken workflows, then maintainability. For each finding, cite the exact path, explain the consequence, and recommend the smallest safe action. Separate verified findings from suspicions and deliberate limitations.

If fixes are requested, preserve source ownership, avoid duplicate files, rerun the failing path plus validation and indexing, and summarize both the resolved issue and what remains unresolved.
