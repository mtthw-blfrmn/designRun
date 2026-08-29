---
name: TypeScript
order: 9
category: Type safety
official_url: https://www.typescriptlang.org/docs/
last_verified: 2026-08-28
---

# TypeScript

TypeScript is the default safety layer for coded product work that will be iterated on by people and agents. It makes component contracts, domain state, data boundaries, and uncertainty explicit before runtime.

## Use when

- The project contains meaningful state models, reusable components, external data, or code likely to evolve.
- Multiple contributors or agents need contracts that can be checked mechanically.
- Runtime branches such as loading, error, success, and permissions benefit from exhaustive modeling.

## Do not use when

- Configuration cost clearly exceeds the value of a deliberately disposable experiment.
- Types would be added as decoration while leaving external data unvalidated and internal contracts vague.
- The owning repository has an explicit different language or migration boundary.

## Agent instructions

1. Inspect the existing `tsconfig`, framework defaults, package scripts, generated types, and lint rules. Extend the local contract rather than replacing it with a generic configuration.
2. Use `strict: true` for new work when compatible with the project. Do not weaken strictness globally to silence a local error.
3. Model domain states with literal types and discriminated unions so impossible combinations are unrepresentable and transitions can be checked exhaustively.
4. Type public component props, function boundaries, data models, events, and reusable hooks. Allow inference inside small, obvious implementations.
5. Treat external input as `unknown` until validated. API responses, storage, URL parameters, imported JSON, and user input do not become safe because an interface was declared.
6. Avoid `any`, broad casts, non-null assertions, and `@ts-ignore`. If a temporary escape hatch is unavoidable, constrain it to the smallest boundary and document the evidence required to remove it.
7. Use unions, generics, and utility types only when they clarify a real contract. Do not build a type puzzle that obscures product behavior.
8. Keep generated and handwritten types clearly separated. Regenerate source-owned types instead of editing generated output.
9. Pair compile-time models with runtime validation wherever data crosses an untrusted boundary.
10. Update types with implementation and tests in the same change; stale types are not documentation.

## Verification

- Run the repository's typecheck with no emit, or its framework-equivalent command.
- Confirm all union branches are handled and intentional unreachable cases use an exhaustive assertion.
- Search changed code for `any`, `unknown` casts, `@ts-ignore`, `@ts-expect-error`, and non-null assertions; justify every remaining escape hatch.
- Test runtime validation with missing, malformed, extra, and stale data.
- Run lint, focused tests, and the production build because successful typechecking does not prove runtime behavior.
- Verify declaration or public API changes do not break known consumers.

## Constraints

- TypeScript erases types at runtime; it does not validate network, storage, or user data by itself.
- `strict` behavior can gain checks across compiler upgrades, so upgrade errors require review rather than blanket suppression.
- Excessively broad structural types can accept values the product did not intend.
- Types support product understanding; they should not replace concise domain documentation.

## Official references

- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [The Basics and strictness](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [`strict` compiler option](https://www.typescriptlang.org/tsconfig/strict.html)
- [`unknown` type](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
