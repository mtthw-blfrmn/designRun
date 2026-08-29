# Reference provenance standard

A design reference is evidence. Its record must let another person or agent identify the source, distinguish observation from interpretation, and determine what may be reused.

## Required fields

- `name`: recognizable product or pattern name.
- `source_url`: canonical product, owner, or publisher URL. Avoid search-result and repost URLs.
- `source_owner`: organization or creator responsible for the source.
- `captured_from`: `canonical-product`, `official-publisher`, `third-party-library`, or `user-supplied`.
- `date_captured`: ISO date for when the reference was inspected.
- `category`: `product`, `interaction`, `motion`, `typography`, `image`, or `system`.
- `tags`: one or more retrieval terms.
- `media`: `none` or a workspace-relative file path.
- `license`: `link-only`, a recognized SPDX identifier, or a concise named license or rights basis such as `editorial-reference`.
- `redistribution`: `external-reference-only`, `review-required`, or `allowed`.

## Evidence rules

1. Write observed behavior before interpretation.
2. Do not claim user outcomes the source does not establish.
3. Preserve uncertainty and the date of inspection.
4. Link to the owner when possible. A discovery library may be recorded in `captured_from`, but it does not replace the canonical product URL.
5. A reference is not permission to reproduce the source.

## Committed media gate

Media may be committed when every condition is true:

- the file is under `resources/inspiration-assets/`;
- `redistribution` is `review-required` or `allowed`;
- `license` is explicit and is neither `unknown` nor `link-only`;
- the source and owner are recorded;
- the file contains no personal, customer, employer-confidential, account, or session data.

`review-required` means the media is present so the repository owner can inspect the real reference before release; it is a public-release blocker, not permission to redistribute. `allowed` means the repository owner has approved that file for distribution in this reference context; it does not grant downstream permission to extract the source interface, artwork, or trademark as a reusable product asset. Before public distribution, replace unresolved media, record an explicit rights basis and change the record to `allowed`, or remove it and use `media: none`.

Otherwise use `media: none` and keep the source external. Always review both the record and the media again before public distribution.
