# Tools

Tools are concrete libraries, services, and inspection surfaces that an agent can use to make or verify design work. Each tool has its own source-backed guide in `resources/tool-library/` with selection criteria, operating instructions, verification steps, and constraints.

Tools do not replace the standards in `resources/design-system.md`, `resources/motion.md`, or `resources/accessibility.md`. They implement or inspect work governed by those resources. Skills define repeatable workflows; Assets are reusable files; Inspiration supplies references.

## How to use the registry

- Confirm that the active harness and project can actually access the tool.
- Open the tool's guide before using it; do not infer an interface from the tool name.
- Check the linked official documentation before installing a dependency or relying on a version-sensitive API.
- Use the smallest tool that can answer the product question without weakening quality.
- Preserve project-specific setup in the owning project; keep shared guidance portable.
- Record consequential tool choices, constraints, or replacements in the project decision log.

## Registered tools

- [Motion for React](tool-library/motion-for-react.md) — production interaction and layout motion.
- [ReactBits](tool-library/reactbits.md) — inspectable animated-component references.
- [Hugeicons](tool-library/hugeicons.md) — the default interface icon system.
- [Figma](tool-library/figma.md) — structured visual source and collaborative canvas.
- [Browser inspection](tool-library/browser-inspection.md) — rendered behavior and implementation evidence.
- [Image generation](tool-library/image-generation.md) — bitmap generation and controlled image editing.
- [React](tool-library/react.md) — stateful component architecture.
- [Vite](tool-library/vite.md) — local prototype development and production builds.
- [TypeScript](tool-library/typescript.md) — explicit contracts and state safety.

## Adding a tool

Add a concrete library, service, or inspection surface—not a vague capability. Create one file in `resources/tool-library/` using the established sections and frontmatter. Document its official link, role, strongest use cases, constraints, privacy and licensing implications, setup, verification method, and the durable source an agent should update after using it. Remove or replace unsupported tools rather than leaving stale guidance in the registry.
