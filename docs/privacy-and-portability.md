# Privacy and portability

designRun is local-first, but a Git repository can still be shared. Treat tracked files as potentially public.

## Keep out of commits

- API keys, tokens, credentials, cookies, and authentication exports
- Raw personal data or customer-confidential research
- Private transcripts and support records
- Licensed assets without redistribution rights
- Unrelated implementation repositories copied into the workspace
- Unreviewed model output

Use an ignored `projects/<project>/private/` folder when appropriate, or keep sensitive sources outside the repository and record only safe provenance. Never place a secret in a source document.

The control-center index skips directories named `private` and `source-files`. Add workspace-relative prefixes to `designrun.config.json` under `indexing.ignoredPathPrefixes` when an embedded implementation or research folder should remain outside control-center search. This is an indexing boundary, not a substitute for `.gitignore`, access control, or safe source handling.

## External actions

Opening designRun or asking an agent to create a local artifact does not authorize publishing, deployment, uploads, messages, external accounts, purchases, or production changes. Give explicit authorization for the exact action and destination.

## Portability

The canonical layer is Markdown, JSON configuration, local assets, and version control. If a harness does not discover skills automatically, direct it to `AGENTS.md` and the relevant `.agents/skills/<workflow>/SKILL.md`.

Before moving or sharing the workspace, run `npm run release:check`, inspect ignored files, and review the Git diff for private or generated content. `npm run check` is the everyday quality gate; `release:check` is intentionally stricter and fails while any included example media still needs redistribution review.
