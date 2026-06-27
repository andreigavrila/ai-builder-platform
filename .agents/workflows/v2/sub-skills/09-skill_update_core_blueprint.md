---
description: Promotes durable knowledge from an accepted v2 change into the versioned core blueprint, records ADRs, refreshes the repository map, and marks affected active changes stale. Use after validation when system-wide truth changed.
---

# Update Core Blueprint V2

Keep the core blueprint aligned with accepted system reality without turning it into a history of feature-local details.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and the core-update gate in `.agents/workflows/v2/references/lifecycle-contract.md`.

Update relevant numbered core files, `00-manifest.json`, `99-traceability.json`, and ADRs. Do not modify implementation code in this workflow.

## Promotion criteria

Promote information only when it is durable and useful to future changes, such as:

- New or changed domain language and invariants.
- Stable component boundaries, dependency rules, interfaces, or data ownership.
- New quality constraints, trust boundaries, or engineering conventions.
- Accepted technology or architectural decisions.
- Material repository structure and verified commands.
- Reusable UX or interaction-system rules.

Keep one-off behavior, task history, transient rollout details, and feature-local test data in the change package.

## Process

1. Confirm the source change is accepted and validation evidence exists.
2. Compare proposed updates with actual code and the current core blueprint.
3. Update only owning artifacts; replace duplication with references.
4. When product evidence resolves an assumption, remove the assumption and incorporate the result into its target product epic or scope boundary; update any related product dependency.
5. Create or supersede ADRs for material architecture decisions.
6. Update traceability and mark superseded nodes without renumbering IDs.
7. Increment `core_version` when interpretation of future work can change.
8. Assess every non-terminal change pinned to the previous version. Mark it `stale` only when the update affects its assumptions, design, or plan.
9. Run the blueprint validator and resolve structural errors.

## Output summary

Report:

- Core version before and after.
- Files and durable rules changed.
- ADRs created or superseded.
- Active changes assessed and any marked stale.
- Accepted change details intentionally left change-local.

Do not rewrite unaffected core sections merely to improve prose; unnecessary churn makes version impact harder to assess.
