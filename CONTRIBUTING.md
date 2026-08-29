# Contributing to designRun

designRun should become more useful without becoming more prescriptive.

Contributions are welcome for reproducible defects, portability, accessibility, reference and privacy safety, agent workflow quality, documentation, and product-design infrastructure that serves more than one private process.

## Principles

- Keep the repository useful immediately after download.
- Preserve local-first operation and explicit external-action boundaries.
- Add instructions only when they improve a real agent decision.
- Keep generic product-design guidance separate from one person's taste or one company's process.
- Prefer a small durable source over duplicate documentation.
- Keep skills discoverable, scoped, and testable.

## Development

Requirements: Git and Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4100` for the local control center. Canonical sources live outside `app/`; do not edit `app/public/workspace-index.json` by hand.

## Change the right owner

- Shared design judgment belongs in `taste/` or an existing specialist source under `resources/`.
- Product-specific facts do not belong in this public template. Use fictional, obviously synthetic fixtures.
- New reference records belong in `inspiration/library/` and must pass `resources/reference-provenance.md`.
- New or changed skills must keep a narrow trigger, use supporting references only when they affect decisions, and pass the workspace plus skill validation gates.
- Control-center changes must preserve file-backed truth, conflict-aware writes, keyboard operation, responsive behavior, and local-only boundaries.

Do not commit derived indexes, build output, private intake, account screenshots, customer work, or external media without explicit redistribution rights.

Before opening a pull request:

```bash
npm run check
```

Describe the user problem, the behavior changed, and how you verified it. Do not include private product data, customer artifacts, secrets, or non-redistributable assets in issues or pull requests.

For interface changes, include the states and viewport sizes inspected. For workflow or instruction changes, include an example request that should trigger the behavior and one that should not.

## Pull-request expectations

- Keep the change scoped to one coherent problem.
- Link an issue when one exists; small fixes do not require a ceremonial issue.
- Explain compatibility or migration impact for source-schema, CLI, skill, or control-center changes.
- Preserve existing user changes and avoid unrelated formatting churn.
- Respond to review with either a revision or a concrete tradeoff explanation.

By contributing, you agree that your contribution may be distributed under the repository’s [MIT License](./LICENSE).
