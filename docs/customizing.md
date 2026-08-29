# Customizing designRun

The repository ships with a quiet monochrome baseline, not a universal aesthetic.

## Recommended order

1. Edit `taste/taste.md` with qualities you protect and reject.
2. Capture real examples in `inspiration/references.md` and save inspectable media in `resources/inspiration-assets/`.
3. Replace the starter tokens and component rules in `resources/design-system.md`, or link the canonical design system for each project.
4. Set the quality bar in `resources/accessibility.md`, `resources/motion.md`, and `resources/content.md`.
5. Update `resources/tools.md` with tools your harness can actually use.
6. Change or add a skill only after a recurring workflow needs different behavior.

Do not complete every source before beginning. Load and improve the sources that can change the next artifact.

## Project overrides

A project may diverge from the shared system when the product has a reason. Record the override in its `decisions.md`, including scope and revisit condition. Do not silently change the global system for one project's exception.

## Adding a workflow

Create `.agents/skills/<workflow>/SKILL.md` with YAML frontmatter containing a lowercase hyphenated name and a description that says what it does and when to use it. Keep the body procedural, route output to a durable owner, and add `agents/openai.yaml` metadata when supported.

Run `npm run validate` after changing skills or structure.

## Changing the control center

The app may discover, search, navigate, edit, and hand off context, but it must not become a second database. Keep durable product context in workspace files and regenerate the index with `npm run index`.

The default visual system is deliberately white, black, neutral gray, compact typography, thin borders, and restrained motion. Change `app/app/globals.css` only when changing the designRun control center itself.
