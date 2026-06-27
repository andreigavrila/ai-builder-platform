---
description: Produces proportionate functional specification, technical design, and verification design for a v2 patch, feature, or initiative. Use after impact analysis and before implementation planning.
---

# Design Change V2

Define intended behavior and implementation constraints without duplicating the core blueprint.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Depending on profile and classification, write:

- `04-specification.md`
- `05-technical-design.md`
- `06-test-plan.md`

Update relevant design, rule, NFR, ADR-candidate, and test nodes in `99-traceability.json`. Set state to `specified` only after the specification gate passes.

## Functional specification

For each affected requirement define only applicable items:

- Preconditions, trigger, inputs, processing rules, outputs, and postconditions.
- Invariants and state transitions.
- Success, failure, boundary, empty, authorization, concurrency, retry, and idempotency behavior.
- Time, ordering, precision, localization, and compatibility behavior where relevant.
- Observable acceptance examples using Given/When/Then or equivalent tables.

Reference durable domain rules instead of copying them. Propose core updates separately when a durable rule changes.

## Technical design

Define:

- Chosen approach and alternatives considered.
- Impacted components and dependency direction.
- Interface, event, schema, state, configuration, and data-flow changes.
- Migration, compatibility, rollout, rollback, and feature-flag strategy.
- Security, privacy, performance, reliability, observability, and accessibility treatment.
- Failure modes and recovery behavior.
- ADR candidates and core-blueprint update candidates.

Use version ranges or repository-confirmed versions. Do not guess current dependency versions.

## Test plan

Map requirements and risks to the cheapest test level that provides credible evidence:

- Unit, component, integration, contract, end-to-end, migration, property-based, security, accessibility, performance, or operational checks as applicable.
- Exact critical fixtures and boundary values where they matter.
- Required regression checks and manual inspections.
- Evidence expected from each check.

Do not prescribe arbitrary test-layer percentages. Do not place large proto-test suites in Markdown; implementation creates actual test files.

## Profile behavior

- Patch: omit separate artifacts only when `02-classification.md` explains why and `07-implementation-plan.md` can contain the necessary specification and checks without ambiguity.
- Feature: produce all three artifacts.
- Initiative: produce all three artifacts and decompose into coordinated subordinate changes when one implementation plan would be unsafe or unreviewable.

## Quality gate

- Every active requirement is designed or explicitly deferred.
- Every material risk has a prevention, detection, recovery, or accepted-risk decision.
- No blocking decisions remain.
- The design is specific enough to plan but does not predict unrelated files or code details.
