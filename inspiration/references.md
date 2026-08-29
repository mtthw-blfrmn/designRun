# Reference library

This library contains analyzed product references, not a pile of screenshots. Each record names the source, separates observation from interpretation, and states what may be reused.

The included records were abstracted from the original designRun workspace. Personal work, employer material, customer material, and generated imitations were removed. Third-party media is not redistributed; open the canonical source named in each record when you need to inspect the original.

## Use a reference

1. Open a record in `inspiration/library/`.
2. Verify the canonical source is still available and inspect the current product.
3. Read `What works`, `Principle to inherit`, and `Do not copy literally`.
4. Cite the reference record in the project brief, decision, critique, or deliverable where it changed a choice.
5. Re-check licenses before reusing any external media or production asset.

## Add a reference

Run `npm run new:reference -- "Reference name" "https://canonical-source.example" "Source owner"`, or copy `templates/reference.md` into `inspiration/library/` and replace its tokens. Complete every frontmatter field. The workspace validator rejects incomplete provenance and unsafe committed media.

Keep one product behavior or coherent visual system per record. Record observed facts before design conclusions. A reference should make a future decision more precise; if it only communicates a vibe, it is not ready.

## Media boundary

`media: none` means the record is analysis-only. `redistribution: review-required` means real media is present for repository-owner review but blocks public release until it is removed or approved with an explicit rights basis. See `resources/reference-provenance.md` and `resources/inspiration-assets/README.md`.
