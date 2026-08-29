# Relay Sample brief

> Worked example: Relay and all supporting evidence are fictional.

## Product

Relay helps volunteer coordinators prepare, review, and send a bounded outreach campaign without managing a spreadsheet, message editor, and delivery log as separate systems.

## Problem

Small community organizations coordinate time-sensitive outreach with uneven data and limited operational capacity. A coordinator often cleans a contact list, writes a message, checks consent, sends from another tool, and reconciles replies manually. The work is fragile because the campaign definition, audience state, send policy, and results do not share one source of truth.

## Users and actors

- **Primary user:** volunteer coordinator responsible for one campaign.
- **Administrator:** organization owner who controls senders, consent policy, and member access.
- **Recipient:** volunteer or community member receiving the message.
- **System actor:** delivery provider returning validation, delivery, and reply events.
- **Beneficiary:** the program team that needs a reliable staffed event or completed outreach goal.

## Desired outcome

A coordinator should be able to turn an imperfect contact file into a reviewable campaign, resolve blocking data or consent problems, send only the approved audience, and understand outcomes without reconstructing state from multiple tools.

## Product objects

- Organization
- Member and role
- Contact
- Consent record
- Audience
- Campaign draft
- Message variant
- Validation issue
- Send run
- Delivery event
- Reply

## Scope

### Now

- Create one campaign draft from a CSV file.
- Map required contact fields and surface row-level validation issues.
- Define an audience from valid, consented contacts.
- Write and preview one message.
- Review counts, exclusions, sender, and message before a simulated send.
- Show deterministic send and delivery states with a reply inbox.

### Later

- Reusable audience segments and message templates.
- Scheduled and recurring campaigns.
- Multiple delivery channels.
- Automated reply classification and suggested follow-up.
- Production delivery-provider integration.

### Non-goals

- CRM replacement or long-term constituent record.
- Purchasing contact data or inferring consent.
- Unreviewed autonomous sending.
- Multi-step journey automation.
- Billing, fundraising, or event registration.

## Constraints

- Consent must be explicit, inspectable, and enforced at send time.
- The sample uses synthetic data and simulates delivery; it performs no external mutation.
- Imported files may contain personal data in a real implementation and require retention, deletion, and access controls.
- A send run is immutable after submission; corrections create a new draft.
- The first release supports keyboard and pointer workflows at 320 CSS px and wider.
- All asynchronous states require deterministic retry or recovery behavior.

## Success

- A coordinator can reach a valid review state without leaving the workspace.
- Every excluded recipient has one inspectable blocking reason.
- The approved audience count equals the immutable send-run recipient count.
- A duplicate submission cannot create a second send run.
- A user can recover a saved draft after refresh and distinguish saved from unsaved changes.
- Keyboard-only users can complete import, mapping, correction, review, and simulated send.

## Open questions

- Should row correction happen inline or through source-file replacement in the first release?
- Which consent evidence is sufficient when a CSV supplies a boolean without provenance?
- Is the message preview a true provider render or a product approximation?
- What retention window applies to rejected import rows?
