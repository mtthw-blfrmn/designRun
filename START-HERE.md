# Start here

designRun is the project you open in an agent harness. There is no account, cloud service, or special “design run” object to create.

## 1. Get your own copy

On GitHub, choose one:

- **Use this template** to create a repository you control.
- **Code → Download ZIP** for a folder without Git setup.
- Clone with `git clone https://github.com/mtthw-blfrmn/designRun.git`.

Open the resulting repository root in your agent harness. Do not open only `app/`; the root contains the instructions, skills, shared standards, and project memory.

## 2. Start working

Open this repository root in Codex, Claude Code, Cursor, or another repository-aware agent and ask for the design outcome directly:

```text
I am designing a product called Atlas. It helps independent consultants see which client work is at risk. Set up the project, shape the brief from what I know, and tell me the most important uncertainty to resolve first.
```

The agent should create the project structure when one is needed, read the relevant shared standards, and save durable work in the owning project. You should not have to operate designRun as a separate process or translate ordinary design requests into framework terminology.

The included Relay Sample is fictional teaching material. To inspect it first, ask:

```text
Show me how the Relay Sample connects its brief, research, decisions, user flow, PRD, and To‑Dos. Do not treat it as evidence for my product.
```

When you are ready for a clean workspace, follow `docs/sample-project.md` or ask the agent to remove the sample project and its two sample tasks.

Useful first requests:

```text
Review this onboarding flow against the brief, evidence, Taste, and accessibility rules. Prioritize the three changes that matter most. Do not implement yet.
```

```text
Turn these interview notes into evidence-backed findings, update the project research source, and tell me which product decision they change.
```

```text
Build a working prototype for the riskiest part of this flow. Use the project system, cover the important states, and verify it in the browser.
```

## 3. Open the optional control center

The browser app is optional, but it is the primary control surface for browsing and editing the same sources your agent reads.

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4100`. It stays local, follows source changes made by your agent, and never becomes a second database.

Codex in the ChatGPT desktop app is the recommended experience because it can work with the folder and inspect local product UIs in its built-in browser. Codex CLI, Codex IDE, Claude Code, Cursor, and other harnesses can still use the file-backed workspace; browser capabilities vary by harness.

Node.js 22.13 or newer is required for these local tools. If port 4100 is already in use, stop the other process before restarting; designRun deliberately uses one predictable local address.

## 4. Know what the agent changes

The agent may create and edit files inside your local copy to produce the work you request. It should not publish, deploy, upload, message, purchase, or connect external accounts without your explicit authorization. Review changes with your normal Git workflow before sharing them.

## 5. Where work belongs

- Product-specific facts, research, decisions, prototypes, and deliverables go in `projects/<project>/` or its recorded implementation repository.
- Durable design judgment goes in `taste/`.
- Traceable references go in `inspiration/`.
- Reusable system rules and reviewed assets go in `resources/`.
- Proven cross-project solutions go in `patterns/` only after review.
- Reusable agent procedures live in `.agents/skills/`.

If you are unsure where something belongs, ask the agent. Source ownership is part of the system.

## Verify the workspace

```bash
npm run validate
npm run check
```

`validate` checks source integrity. `check` additionally runs tests, lint, indexing, and a production build.
