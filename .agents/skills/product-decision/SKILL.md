---
name: product-decision
description: Frame and resolve a consequential product or design choice using evidence, constraints, alternatives, and tradeoffs. Use when the user asks what to choose, compare directions, make a recommendation, or document an approved decision.
---

# Product decision

Read the brief, current decisions, relevant research, and only the shared standards that constrain the choice.

## Decide

1. Write the decision as a concrete question with a named owner and time horizon.
2. Identify the user outcome, product promise, constraints, and evidence that matter.
3. Describe two or more credible alternatives. Include the status quo when it is real.
4. Compare alternatives on the dimensions that can change the answer: user value, comprehension, risk, accessibility, reversibility, operational cost, technical fit, evidence quality, and learning value.
5. State unknowns explicitly. Do not turn preference or convention into evidence.
6. Recommend one direction and explain why it wins now, what it sacrifices, and what would make the recommendation wrong.
7. Prefer a reversible experiment when evidence is weak and the cost of commitment is high.

If the user approves the choice, add it to `projects/<project>/decisions.md` with a stable decision ID, status, owner, date, scope, evidence IDs, rationale, rejected alternatives, implications, reversibility, and an explicit revisit condition or review date. Name which requirements, flows, or system contracts it supersedes. Do not record an unapproved recommendation as an approved decision.
