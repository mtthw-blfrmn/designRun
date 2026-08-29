# Agent harnesses

designRun keeps its canonical guidance in `AGENTS.md` and reusable workflows in `.agents/skills/`. Small adapter files point other harnesses back to the same operating model.

## Codex

Open the repository root. Codex discovers root and nested `AGENTS.md` files and repository skills in `.agents/skills/`.

The recommended experience is Codex in the ChatGPT desktop app: it can open the folder and share a built-in browser for local app previews, rendered-state inspection, screenshots, and interaction checks. The built-in browser is not available in Codex CLI or the Codex IDE extension, so those environments should use their available browser or test tools and report any visual verification limit.

## Claude Code

`CLAUDE.md` routes Claude Code to the canonical repository instructions. If skill discovery differs in your installed version, point the agent to the relevant `.agents/skills/<skill>/SKILL.md` explicitly.

## Cursor

The repository includes an always-applied rule at `.cursor/rules/designrun.mdc`. Open the repository root so project paths resolve correctly.

## GitHub Copilot

`.github/copilot-instructions.md` contains a concise adapter. Use `AGENTS.md` and project files for the full operating model.

## Other harnesses

Tell the agent to read `AGENTS.md`, then the active project and relevant skills. The workspace does not assume a specific model, tool API, or cloud service.

Capabilities and discovery behavior change across harness versions. When automatic discovery fails, explicit file references are the reliable fallback. Do not claim that every harness supports repository skill discovery, live browser inspection, image generation, Figma, or external connectors merely because designRun contains a workflow for the task.
