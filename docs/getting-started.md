# Getting started

## 1. Open the project

Open the repository root—not only `app/`—in your agent harness. That is how it discovers `AGENTS.md`, shared sources, projects, and repository skills. Ask for your product-design outcome directly; the agent should set up a project when ownership requires one.

Codex in the ChatGPT desktop app is recommended when you want the agent and designer to share a built-in browser for local product inspection. The file-backed workspace also works without that browser.

Before creating your project, browse `projects/relay-sample/` or open Relay Sample in the control center. It is a fully fictional worked example that connects a brief, synthetic evidence, decisions, a stateful user flow, a technical PRD, prototype notes, and sample tasks. Read `docs/sample-project.md` for the trace and removal steps.

## 2. Open the optional control center

```bash
npm ci
npm run dev
```

The local control center is available at `http://127.0.0.1:4100`. It watches canonical sources and refreshes automatically while it is open.

## 3. Create a project

Ask your agent:

```text
Set up a new designRun project called Atlas. Help me shape the brief from what I know, and mark missing evidence instead of inventing it.
```

Or use the helper:

```bash
npm run new:project -- "Atlas"
```

The project becomes visible in the control center from its Markdown sources.

When the product gains a concrete prototype, app, deck, export, or maintained artifact, ask the agent to create a deliverable or use:

```bash
npm run new:deliverable -- atlas "Onboarding prototype"
```

The control center groups Markdown under `projects/atlas/deliverables/onboarding-prototype/` as one deliverable.

You do not need to run the helper yourself when the agent can work in the repository.

## 4. Make the shared system yours

Start with `taste/taste.md`, `inspiration/references.md`, and `resources/design-system.md`. The inspiration library includes 14 analyzed external-product references under `inspiration/library/`, each with source-attributed editorial visual evidence. Refine accessibility, motion, content, research, and tools only as they become relevant. The workspace should learn through product work, not require a long configuration ritual.

## 5. Work through your agent

Ask for the product artifact directly:

```text
Use Atlas's brief and research to decide the onboarding model. Compare the credible alternatives, recommend one, and record the decision only after I approve it.
```

The relevant skill guides the workflow. The output belongs in Atlas or its named implementation repository; designRun does not create a separate session record.

## 6. Use the control center

- Add or triage tasks in To‑Do.
- Open a project, then browse its deliverables and documents.
- Search Inspiration, Skills, Tools, and shared sources.
- Edit Markdown and save it back to disk.
- Copy a context-aware agent prompt from the current object.

## 7. Promote what survives

When a prototype produces a reusable behavior, ask the agent to review it as a promotion candidate. Promote only the portable principle, state model, token, component rule, or motion behavior—not the product's copy, data, or branding.

Run `npm run validate` to check source integrity and `npm run index` to refresh the derived index.
