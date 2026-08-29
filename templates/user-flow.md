# User flow — Replace with task

## Contract

- Actor:
- Entry condition:
- Trigger:
- Intended outcome:
- Product object:
- Critical transition:

## State model

```mermaid
stateDiagram-v2
  [*] --> Start
  Start --> Complete: valid user action / persisted effect
  Start --> Error: recoverable failure / no destructive effect
  Error --> Start: retry
  Complete --> [*]
```

## Transition table

| From | Event | Guard | System effect | Feedback | To | Recovery |
|---|---|---|---|---|---|---|
| | | | | | | |

## State requirements

Cover empty, loading, partial, invalid, permission-denied, error, retry, cancellation, back navigation, resume, concurrent update, and terminal states when relevant.

## Assumptions and open decisions

## Riskiest transition and validation

