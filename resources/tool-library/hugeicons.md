---
name: Hugeicons
order: 3
category: Icon system
official_url: https://hugeicons.com/docs/integrations/react/overview
last_verified: 2026-08-28
---

# Hugeicons

Hugeicons is the default interface icon system. The portable React baseline uses the free Stroke Rounded set through `@hugeicons/react` and `@hugeicons/core-free-icons`; filled styles are not the default.

## Use when

- A control, status, navigation item, tool, setting, or metadata label benefits from a familiar interface symbol.
- One consistent stroke family can replace mixed ad hoc SVGs.
- A semantic wrapper can enforce project sizing, stroke, color, and accessibility rules.

## Do not use when

- The visual is a product logo, supplied brand mark, illustration, or artifact-specific graphic.
- Text alone is clearer, especially in primary navigation or buttons where the project intentionally omits icons.
- No glyph accurately represents the concept without explanation.

## Agent instructions

1. Check the active project's icon decision before adding anything. Existing interface restraint takes precedence over the availability of a glyph.
2. Search Hugeicons by meaning, then verify the exact exported icon name in the installed package or official documentation. Do not invent component names.
3. For the free React set, install `@hugeicons/react` and `@hugeicons/core-free-icons` in the owning application. Use a licensed Pro package only when the project explicitly has access.
4. Import only the glyphs used. Avoid namespace or wildcard imports that weaken tree-shaking.
5. Render icons through one semantic app-level wrapper around `HugeiconsIcon`. Set defaults such as `color="currentColor"`, project-controlled size, and project-controlled `strokeWidth` in that wrapper.
6. Use the Stroke Rounded family consistently. Do not fill a stroke icon or mix bulk, solid, duotone, and stroke families without an approved system decision.
7. Treat decorative icons as hidden from assistive technology when adjacent text already names the action. Give every icon-only interactive control an accurate accessible name and, where helpful, a tooltip.
8. Pair state icons with state text or another non-icon cue when the distinction matters. Do not rely on shape or color alone.
9. Check optical alignment at rendered size. Align to surrounding type and control geometry, not only the raw SVG box.
10. Add new semantic aliases to the local icon module; components should import product meanings from that module rather than reaching into the package everywhere.

## Verification

- Confirm the exact glyph communicates the intended action in context.
- Inspect 16, 18, 20, and 24 pixel sizes as applicable; verify stroke weight stays coherent.
- Test light and dark themes through `currentColor` and semantic color tokens.
- Verify icon-only controls expose a useful accessible name and visible focus state.
- Run the production build and inspect bundle output for accidental whole-library imports.
- Search the implementation for filled icons or raw mixed-source SVGs that bypass the wrapper.

## Constraints

- The free package currently provides Stroke Rounded icons; other styles require the appropriate Pro license and registry access.
- Icons must not replace necessary labels or introduce decorative noise.
- Do not alter an official brand mark to resemble Hugeicons.
- Recheck package exports after upgrades; documented names and aliases can change.

## Official references

- [Hugeicons with React](https://hugeicons.com/docs/integrations/react/overview)
- [React quick start](https://hugeicons.com/docs/integrations/react/quick-start)
- [React best practices](https://hugeicons.com/docs/integrations/react/best-practices)
- [`HugeiconsIcon` wrapper](https://hugeicons.com/docs/integrations/react/wrapper)
