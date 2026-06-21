---
description: Determines how a classified v2 change affects the core blueprint, repository, interfaces, data, UX, quality attributes, tests, operations, and active work. Use before designing any patch, feature, or initiative.
---

# Analyze Change Impact V2

Build an evidence-backed impact boundary before choosing a design.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Write `changes/{CHANGE-ID}/impact-analysis.md` and update traceability edges to impacted core nodes.

## Process

1. Read the normalized request, classification, pinned core version, and relevant traceability neighborhood.
2. Inspect the repository using the repository map as an index, then verify the map against actual files.
3. Trace current behavior through entry points, domain logic, persistence, integrations, UI, configuration, tests, and deployment surfaces as applicable.
4. Identify direct impact, indirect impact, unaffected boundaries, and uncertain impact.
5. Identify conflicts with active changes and assumptions invalidated by current code.
6. Determine whether the selected profile remains adequate.
7. Mark the change blocked only when a material impact cannot be resolved safely from available evidence.

## Required analysis

- Requirements, rules, NFRs, and ADRs affected.
- Modules and files likely to change, with evidence rather than a premature complete manifest.
- Public and internal contracts affected.
- Data shape, migration, backfill, retention, and rollback implications.
- Authorization, privacy, trust-boundary, and abuse implications.
- UX states, accessibility, localization, and compatibility implications.
- Performance, reliability, observability, deployment, and operational implications.
- Existing tests and required regression surfaces.
- Documentation and core-blueprint candidates.
- Risks, unknowns, and proposed mitigations.

## Quality gate

- Each claimed impact cites a core ID, repository path, interface, or verified behavior.
- Unaffected areas are not asserted without evidence when the risk is material.
- Architecture or security changes are routed to technical design regardless of profile.
- The analysis states whether the core blueprint is accurate, incomplete, or stale for the impacted area.
