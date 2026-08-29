---
name: Vite
order: 8
category: Development environment
official_url: https://vite.dev/guide/
last_verified: 2026-08-28
---

# Vite

Vite is the lightweight local development and production-build foundation for standalone web prototypes. It provides a development server with fast module updates and a separate optimized build step.

## Use when

- A standalone web prototype needs a predictable local server and production build.
- The project does not already have a framework-owned development environment.
- Fast iteration on React or vanilla TypeScript will materially improve design exploration.

## Do not use when

- The owning product already has a build system, framework, route, or prototype environment.
- Running a second server would split source of truth or create conflicting dependency trees.
- The artifact does not need a web runtime.

## Agent instructions

1. Inspect the repository root, package manager, lockfile, Node engine, scripts, and existing Vite configuration before changing anything.
2. Reuse the existing application when one exists. Scaffold only inside the explicitly owning project and never at the designRun root unless designRun itself is the target.
3. Prefer the project's pinned Vite and plugin versions. If creating a new prototype, verify current Node compatibility in the official guide before selecting a version.
4. Keep `index.html`, the application entry, and static assets in their conventional ownership. Use imported assets when they participate in the module graph; use `public` only for files that must retain stable names or bypass transformation.
5. Document `dev`, `build`, and `preview` commands and one predictable local port in the prototype README. Use strict port behavior when another server would make the URL ambiguous.
6. Keep client environment variables intentionally public. Anything exposed through a `VITE_` prefix is bundled into client code and must never contain a secret.
7. Set `base` and asset paths for the actual hosting or preview context. Do not hard-code local absolute paths that fail in the production build.
8. Add plugins only for requirements the project actually has. Review plugin maintenance, execution scope, and build impact before adoption.
9. Treat `vite preview` as local verification of built output, not as a production server.
10. Keep prototype setup portable: clean install, documented commands, no dependence on untracked machine state.

## Verification

- Install from the lockfile in a clean environment and start the documented development command.
- Run the production build, then inspect built output through the documented preview command.
- Check asset URLs, base paths, route refreshes, console output, source maps, and environment-mode behavior.
- Confirm no secret or private server value appears in generated client assets.
- Test the supported browser range or configure an explicit target based on project requirements.
- Verify a port collision fails clearly rather than silently opening a different application.

## Constraints

- Vite's development behavior and production output are different; both require verification.
- Modern development targets do not automatically satisfy an older browser requirement.
- Client-prefixed environment variables are public by design.
- Plugin and Node compatibility changes across major versions; verify before upgrades.

## Official references

- [Vite guide](https://vite.dev/guide/)
- [Building for production](https://vite.dev/guide/build)
- [Environment variables and modes](https://vite.dev/guide/env-and-mode.html)
- [Command-line interface](https://vite.dev/guide/cli)

