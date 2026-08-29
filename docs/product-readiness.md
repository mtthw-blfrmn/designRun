# Product readiness

This document records the end-to-end review of designRun against its originating workspace model and control-center responsibilities. It separates shipped behavior from deliberate boundaries so the interface does not promise capabilities the local workspace cannot provide.

## Core responsibilities

| Responsibility | designRun implementation | Readiness |
| --- | --- | --- |
| Workspace control center | To‑Do, Projects, Inspiration, Taste, Design System, Assets, Tools, Skills, and Guide share one navigation model | Ready |
| Durable product context | Canonical Markdown and JSON-backed records live beside agent instructions | Ready |
| Project work | Project and deliverable scaffolds preserve ownership, evidence, decisions, prototypes, verification, and shipping boundaries | Ready |
| Agent workflows | Fourteen repository skills cover setup, research, decisions, requirements, flows, prototypes, critique, image direction, implementation, polish, references, tasks, audits, and promotion | Ready in Codex; portable as readable instructions elsewhere |
| Shared standards | Taste, references, design-system rules, tools, assets, and promoted patterns are independently owned sources | Ready |
| Source editing | The control center reads and edits allowlisted Markdown with conflict detection and atomic replacement | Ready |
| Parallel work | The source index watches agent edits and the browser refreshes without replacing an unsaved draft | Ready for local file concurrency |
| Visual references | Fourteen analyzed product-reference records pair inspectable media with provenance, canonical links, transfer principles, and explicit reuse boundaries | Ready |

## First-use journey

1. The designer downloads or clones the folder and opens the repository root in a repository-aware agent harness.
2. They describe the product and desired outcome in ordinary language. They do not need to know designRun's internal vocabulary.
3. The agent reads `AGENTS.md`, selects the relevant workflow, inspects shared and project-owned sources, and creates a project or deliverable when ownership does not exist yet.
4. The designer may run `npm ci && npm run dev` to use the local control center. This step is optional; the plain files remain the product's source of truth.
5. The agent and control center work over the same files. Agent changes appear in the browser; browser saves appear to the agent.
6. Reusable work remains project-owned until the pattern-promotion workflow proves that it belongs in the shared layer.

## Hardened behavior

- Source discovery ignores dependencies, builds, vendor trees, private intake, symlinks, and configurable implementation paths. Per-file and total-index limits prevent accidental indexing of an embedded codebase.
- Workspace validation checks required sources, adapters, templates, project and deliverable frontmatter, to-do schema and identifiers, reference provenance and redistribution safety, skill identity, and control-center support files.
- Browser writes are same-origin, content-type checked, size capped, path allowlisted, symlink safe, conflict aware, and atomic. Asset delivery uses a separate allowlist and video range requests.
- The control center polls its generated index and refreshes the active source when safe, while preserving an unsaved local draft.
- The public template includes one explicitly fictional Relay project and two visibly labeled sample tasks so a first-time user can trace the system end to end. Removal instructions return it to an empty workspace.
- The reference library preserves useful analysis and source-attributed editorial visual evidence from the original source while excluding personal, employer, customer, and generated-imitation material. Third-party-library footer chrome is removed from committed screenshots; the canonical product and owner remain recorded.
- Full YAML frontmatter parsing prevents ordinary multiline metadata from being silently discarded.
- The Agent command includes the current area, document, project, or deliverable and copies an explicit handoff into any harness with the repository open.
- Every interface icon uses the free Hugeicons React package through one wrapper. The supplied designRun logo remains a brand mark, not an interface icon.
- Motion uses shared high-damping timing and easing, compositor-friendly view and modal transitions, truthful async ownership, and an effectively immediate reduced-motion path.
- Desktop, dark theme, command dialog, every primary workspace area, 320px reflow, rapid navigation, focus return, and modal mobile navigation have been exercised in the local app.

## Deliberate boundaries

- The control center cannot inject a command directly into every third-party harness. Clipboard handoff is the universal local boundary; deeper integration would require a harness-specific extension or protocol.
- Automatic skill discovery varies by harness. Codex can discover repository skills; other agents can still follow `AGENTS.md` and the skill files, but their native loading behavior is outside designRun's control.
- Browser-driven UI verification depends on the chosen harness. The Codex desktop app is recommended because its local browser can inspect the running product; CLI and IDE-only environments need their own browser or test tooling.
- This is not a cloud collaboration service. There is no account system, remote database, multiplayer presence, hosted sync, or automatic publishing.
- The source editor is intentionally Markdown-first rather than a block editor or a Figma replacement. It renders the repository's working documents and does not attempt to reproduce every rich-authoring affordance.
- External systems such as Figma, issue trackers, analytics, or deployment platforms are not silently bundled. The active harness may use installed tools only when the user authorizes that work.
- Very large media libraries and embedded implementation repositories should be excluded or referenced, not indexed wholesale. Limits can be adjusted in `designrun.config.json` when the owner understands the cost.

## Release gate

A change is ready when all of these hold:

- `npm ci` succeeds from a clean copy.
- `npm run check` validates sources, runs tests, lints the app, rebuilds the index, and produces a production build.
- `npm run release:check` passes. This repeats the full check, blocks tracked private or unresolved-rights example media, and rejects high-severity dependency advisories.
- A new project and a new deliverable can be created from their templates and discovered by the index.
- The local control center loads without browser errors, every primary area is reachable, the command handoff contains its source context, and the mobile navigation remains operable.
- `npm audit` reports no known dependency vulnerabilities.
- No private, personal, customer, employer, non-redistributable media, dependency, or source-intake content appears in the derived index.

## Next expansion points

These are product extensions, not hidden requirements for the current release:

- Harness-specific command bridges when stable extension APIs justify them.
- Richer structured metadata and filtering for large inspiration and asset libraries.
- Optional adapters for external design and research systems.
- Additional automated browser scenarios once the control center gains more transactional UI.
