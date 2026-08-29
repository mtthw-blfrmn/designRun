# Relay Sample decisions

> Worked example only. These decisions are internally consistent sample records, not decisions from a real product.

## D-01 — Treat review as an immutable submission boundary

**Status:** approved for sample

**Owner:** Sample product lead

**Date:** 2026-08-23

**Scope:** Campaign review and send-run creation

**Decision:** Submitting from review creates a send run from a specific draft revision, audience snapshot, and message checksum. Later edits create a new draft rather than modifying the submitted run.

**Evidence:** Synthetic finding R-03. It supports the need for a stable authorization boundary but does not validate the exact technical model.

**Why:** The system must explain exactly who was authorized to receive which content and make duplicate submission safe.

**Alternatives:** Submit the mutable draft directly; lock the entire campaign after review.

**Implications:** The API needs idempotent send creation, immutable recipient records, revision identifiers, and a clear “create a new draft” recovery path.

**Reversibility:** The object model is costly to reverse after production send history exists. The visual presentation of revision details remains reversible.

**Supersedes:** Any requirement that allows a submitted audience or message to mutate in place.

**Revisit when:** Shared approval or scheduled sends require a separate authorization object.

## D-02 — Keep audience impact visible during correction

**Status:** approved for sample

**Owner:** Sample product lead

**Date:** 2026-08-24

**Scope:** Mapping, validation, correction, and review

**Decision:** Included, excluded, and unresolved counts remain visible through mapping and correction. Every change recomputes the counts before the next step can continue.

**Evidence:** Synthetic findings R-01 and R-02. They identify a confidence and actionability risk but do not establish the optimal placement or density.

**Why:** A total error count does not expose audience consequence or let a coordinator verify that a correction had the intended effect.

**Alternatives:** Show counts only on review; use a transient success message after each correction.

**Implications:** Validation results need deterministic severity and inclusion effects. Count changes must be announced without stealing focus.

**Reversibility:** Placement and presentation are reversible; the count invariant and rule effects become data contracts once instrumented.

**Supersedes:** Summary-only audience counts that appear for the first time at review.

**Revisit when:** Real testing shows persistent counts distract from row-level correction.
