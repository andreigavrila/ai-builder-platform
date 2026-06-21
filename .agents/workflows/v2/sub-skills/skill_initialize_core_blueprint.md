---
description: Creates or reconstructs the durable v2 core blueprint for a greenfield or existing software project. Use before planning changes when product, domain, architecture, quality, UX, engineering, or repository knowledge is missing or unstructured.
---

# Initialize Core Blueprint V2

Create the durable system description used by future change packages.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Write under `{blueprintDir}`:

- `manifest.json` and `traceability.json`.
- All files under `core/` defined by the artifact contract.
- ADRs only for material decisions that are actually established.

## Inputs

- Project slug and optional project name.
- Available requirements, product notes, architecture documents, and decisions.
- Existing repository and configuration when this is not greenfield.

## Process

1. Determine whether the project is greenfield, brownfield, or partially specified.
2. For an existing repository, inspect code, configuration, tests, schemas, and deployment files before describing current architecture.
3. Separate current verified state from desired future state.
4. Identify missing information and classify it as discoverable, blocking, or non-blocking.
5. Ask only the blocking questions required to establish product boundaries or irreversible constraints.
6. Produce concise core artifacts with stable IDs and cross-references.
7. Initialize core version `1`; use a higher version only when reconstructing documented history.
8. Run the blueprint validator and resolve structural errors.

## Core artifact requirements

### Product

Record purpose, target users, measurable outcomes, supported use cases, scope boundaries, exclusions, dependencies, and product-level risks. Do not invent market evidence or personas.

### Domain

Record shared language, entities, value objects, invariants, durable business rules, lifecycle states, ownership, and external domain events. Keep persistence details in architecture unless they are domain-significant.

### Architecture

Record system context, components, boundaries, dependency rules, data ownership, integration contracts, deployment topology, trust boundaries, and accepted ADRs. For brownfield projects, cite repository evidence.

### Quality

Record applicable and measurable security, privacy, performance, reliability, accessibility, compatibility, observability, and recovery requirements. Include measurement conditions and rationale.

### UX system

Record experience principles, navigation model, semantic tokens, interaction conventions, content behavior, accessibility, responsiveness, localization, and extension points. Avoid specifying screens that do not yet exist.

### Engineering

Record languages and supported versions, package and build conventions, coding rules, test strategy, migration policy, source-control expectations, CI gates, rollout, rollback, and evidence requirements.

### Repository map

Record important paths, module responsibilities, dependency direction, test locations, generated files, ownership, and commands confirmed from the repository. Mark intended paths separately from existing paths.

## Quality gate

- Facts and assumptions are distinguishable.
- Contradictions between requirements and repository reality are surfaced.
- Core files contain durable guidance rather than feature-local implementation plans.
- Unknowns are retained explicitly instead of filled with plausible detail.
- Traceability includes important outcomes, rules, NFRs, and ADRs without creating decorative links.
