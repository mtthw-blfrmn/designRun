# Relay Sample research

> Worked example only. The sources and findings below are synthetic and demonstrate evidence hygiene; they are not market claims.

## Research questions

- Where does a coordinator lose confidence between importing contacts and authorizing a send?
- Which validation problems must block progress, and which can be acknowledged?
- What must remain visible on the final review surface?

## Sources

| Date | Source | Evidence type | Scope and limitations |
| --- | --- | --- | --- |
| 2026-08-20 | Five fictional coordinator walkthroughs using a paper prototype | Moderated task observation | Synthetic participants; useful for workflow defects, not prevalence |
| 2026-08-21 | Synthetic audit of 12 redacted-style CSV fixtures | Artifact review | Fixtures were deliberately constructed; no real organization data |
| 2026-08-22 | Prototype keyboard and recovery walkthrough | Expert evaluation | Demonstrates interaction risk; not a usability outcome |

## Findings

### R-01 — Coordinators need a stable audience count

- **Observation:** In four of five fictional walkthroughs, the participant returned to the audience count after editing field mappings or exclusions.
- **Synthesis:** Confidence depends on seeing how each upstream change affects the set of people who will receive the message.
- **Limitation:** The exercise cannot establish how common this behavior is in real organizations.
- **Implication:** Keep included, excluded, and unresolved counts persistent after import and recompute them after any dependency change.

### R-02 — A generic error count is not actionable

- **Observation:** Participants could not decide whether to continue when shown only “18 invalid rows.”
- **Synthesis:** Validation must identify the rule, affected rows, and consequence.
- **Implication:** Group issues by blocking rule, expose affected rows, and state whether fixing or excluding them changes the send audience.

### R-03 — Review is an authorization boundary

- **Observation:** Participants expected the review screen to freeze the audience and message they were authorizing.
- **Synthesis:** Review is not a summary page; it creates an immutable submission input.
- **Implication:** Generate a draft revision and audience snapshot before submission, then use an idempotency key to create the send run.

## Contradictions and gaps

- One fictional participant preferred replacing the CSV instead of editing rows in the product.
- The sample does not represent high-volume organizations, shared approval, multilingual campaigns, or recipients without digital consent records.
- No real delivery-provider constraints were studied.

## Product implications

- R-01 and R-02 support the validation workspace and persistent count decision in `decisions.md`.
- R-03 supports immutable send-run creation and the review checksum in the PRD.
- Inline correction remains unresolved and should be tested before implementation scope is committed.
