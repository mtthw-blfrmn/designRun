---
name: Image generation
order: 6
category: Image making
official_url: https://developers.openai.com/api/docs/guides/image-generation
last_verified: 2026-08-28
---

# Image generation

Image generation creates or edits bitmap material for concept exploration, photography, illustration, texture, editorial imagery, transparent cutouts, and visual direction. The available model and controls depend on the active harness.

## Use when

- The work needs new bitmap imagery, concept art, photography, illustration, texture, atmosphere, or a controlled edit to an existing image.
- Multiple visual directions need to be explored before committing to production art.
- A supplied image can serve as the explicit edit target or visual reference.

## Do not use when

- The task requires exact interface geometry, a reusable UI component, a precise chart, or editable design-system structure.
- The target is a vector logo, official brand asset, or identity mark that should be sourced or edited natively.
- A reference image is missing and the requested edit cannot preserve the intended subject reliably.

## Agent instructions

1. Read the active brief, Taste, relevant Inspiration records, and asset requirements. Define the image's job, subject, composition, aspect ratio, placement, contrast needs, and output format.
2. Inspect every supplied target or reference before generating. Distinguish edit targets from inspiration; do not treat an unrelated reference as permission to reproduce protected identity or private content.
3. Use the harness's supported image tool. For edits, attach the exact target and describe what must change and what must remain invariant. For new generation, omit accidental reference images.
4. Write prompts in observable terms: subject, camera or viewpoint, environment, materials, lighting, palette, composition, depth, typography requirements, and exclusions. Ground style in project principles rather than naming a living artist.
5. Generate at the intended aspect ratio and with enough resolution for the final placement. Request transparency only when the format and tool support it.
6. Iterate one decision at a time when precision matters. Preserve successful composition and subject identity while changing the smallest necessary variable.
7. Treat embedded text, logos, UI, hands, reflections, repeated geometry, and product details as high-risk regions that require close inspection or later native reconstruction.
8. Keep generated output in project evidence or working files until reviewed. Promote it to `resources/asset-library/` only after quality, provenance, rights, and reusability review.
9. Record the model or tool, date, source references, prompt intent, edits, and disclosure requirements when the image becomes a durable artifact.
10. Do not publish generated media or send it to an external destination without explicit authorization.

## Verification

- Inspect the full-resolution output, not only a chat thumbnail.
- Check composition, cropping, anatomy, perspective, reflections, repeated elements, artifacts, text, and brand accuracy.
- Place the image in the real interface at target size and test light and dark contexts, responsive crops, overlays, and text contrast.
- Compare edits with the source to ensure protected details and subject identity were preserved as requested.
- Verify file format, transparency, color profile, dimensions, compression, and performance budget.
- Complete rights, privacy, consent, provenance, and disclosure review before promotion or release.

## Constraints

- Generated imagery is probabilistic and should not be used as factual evidence.
- Exact typography, vector geometry, UI layout, and official brand marks usually need native reconstruction or approved source assets.
- Model capabilities, cost, safety rules, and supported dimensions change; verify the active tool's current documentation.
- Never upload confidential references to an external generator unless the project's privacy rules and user authorization allow it.

## Official references

- [OpenAI image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- [GPT Image model reference](https://developers.openai.com/api/docs/models/gpt-image-2)
