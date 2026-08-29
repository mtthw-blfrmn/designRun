# designRun repository guidance

`AGENTS.md` is the canonical operating model. Read it together with the active project brief and decisions before proposing product or interface changes.

- Keep project-specific choices in `projects/<project>/`.
- Keep shared judgment in `taste/`, `inspiration/`, and `resources/`; keep reviewed reusable patterns in `patterns/`.
- Do not edit `app/public/workspace-index.json` by hand; it is generated.
- Use semantic tokens and accessible primitives for UI work.
- Do not publish or mutate external systems without explicit authorization.
