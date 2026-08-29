---
name: Figma
order: 4
category: Design source
official_url: https://developers.figma.com/docs/figma-mcp-server/
last_verified: 2026-08-28
---

# Figma

Figma is a collaborative design source and implementation reference when a named file, library, component, or node owns the visual specification. Its structured components, variables, auto layout, annotations, and Code Connect relationships are more authoritative than a flattened screenshot.

## Use when

- The user supplies a Figma file or node, or the project names Figma as source of truth.
- Work requires visual specifications, component libraries, variables, prototypes, review, or design-to-code context.
- The active harness has an authorized Figma connector, MCP server, or other supported integration.

## Do not use when

- No Figma source exists and the coded product or another artifact owns the truth.
- A screenshot is being treated as sufficient evidence for states, tokens, components, or responsive behavior.
- The requested write would mutate an external file without explicit user authorization.

## Agent instructions

1. Resolve the exact file, page, frame, component, or node before working. Preserve its URL and node ID in the project context; never guess which similarly named frame is current.
2. Check available first-party Figma tools and permissions. Remote MCP access is link-based; write access depends on seat, file permission, client support, and explicit authorization.
3. For design-to-code work, inspect structured design context for the exact node. Retrieve variables and styles, component relationships, Code Connect mappings, annotations, relevant assets, and a screenshot for visual comparison.
4. Search the file or connected libraries before creating a new component, variable, or style. Reuse system primitives and variants rather than drawing look-alike frames.
5. Translate variables into semantic project tokens. Do not paste raw values into code when an existing token or component contract owns the meaning.
6. Treat generated React-like context as design context, not production code. Adapt it to the repository's framework, component architecture, content model, accessibility rules, and responsive behavior.
7. When writing to Figma, build native, editable structure: auto layout, components, properties, variants, variables, semantic layer names, and real text. Avoid flattened screenshots and unstructured shape piles.
8. Inspect all material states and variants, including loading, empty, error, disabled, focus, overflow, narrow widths, and long content. A single frame is not evidence of the complete product.
9. Compare implementation and source at representative sizes. Record intentional divergences, missing states, and unresolved ambiguity in the active project's decisions.
10. Do not upload, publish, move, delete, or alter shared Figma material outside the explicit request.

## Verification

- Confirm the inspected node ID and current file state match the user-supplied reference.
- Compare a rendered implementation screenshot with the Figma source at the same viewport and content state.
- Verify components map to existing code primitives where Code Connect or local mappings exist.
- Check variable names, values, modes, component properties, auto layout, constraints, and asset fidelity.
- Resize the source frame and implementation to expose unintended absolute positioning or overflow.
- Verify any write produced editable native layers and did not duplicate existing library components.

## Constraints

- Figma permissions and tool availability vary by plan, seat, file, and MCP client.
- A Figma frame can express visual intent without defining application behavior, data boundaries, or accessibility by itself.
- Do not expose private file data or assets outside the authorized project.
- Never treat generated code context as a substitute for repository inspection and production verification.

## Official references

- [Figma MCP server](https://developers.figma.com/docs/figma-mcp-server/)
- [Tools and prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Structure a Figma file for better code](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/)
- [Code Connect integration](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)

