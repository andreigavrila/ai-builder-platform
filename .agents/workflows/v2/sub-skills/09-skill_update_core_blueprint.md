---
description: Promotes durable knowledge from an accepted v2 change into the versioned core blueprint, records ADRs, refreshes the repository map, and marks affected active changes stale. Use after validation when system-wide truth changed.
---

# Update Core Blueprint V2

Keep the core blueprint aligned with accepted system reality without turning it into a history of feature-local details.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md`, `.agents/workflows/v2/references/knowledge-layer-contract.md`, and the core-update gate in `.agents/workflows/v2/references/lifecycle-contract.md`.

Update relevant numbered core files, distilled operational artifacts under `03-operational/`, `00-manifest.json`, `99-traceability.json`, and ADRs. Do not modify implementation code in this workflow.

## Promotion criteria

Promote information only when it is durable and useful to future changes, such as:

- New or changed domain language and invariants.
- Stable component boundaries, dependency rules, interfaces, or data ownership.
- New quality constraints, trust boundaries, or engineering conventions.
- Accepted technology or architectural decisions.
- Material repository structure and verified commands.
- Reusable UX or interaction-system rules.
- New or changed production-agent rules, custom skill needs, or custom validation expectations that should be distilled from the core.

Keep one-off behavior, task history, transient rollout details, and feature-local test data in the change package.

## Process

1. Confirm the source change is accepted and validation evidence exists.
2. Compare proposed updates with actual code and the current core blueprint.
3. Update only owning artifacts; replace duplication with references.
4. When product evidence resolves an assumption, remove the assumption and incorporate the result into its target product epic or scope boundary; update any related product dependency.
5. Create or supersede ADRs for material architecture decisions.
6. Refresh or mark stale the distilled operational layer when promoted knowledge changes production-agent behavior.
7. Update custom skill plans or custom check workflows when a promoted decision changes repeatable construction or validation work.
8. Update traceability and mark superseded nodes without renumbering IDs.
9. Increment `core_version` when interpretation of future work can change.
10. Assess every non-terminal change pinned to the previous version. Mark it `stale` only when the update affects its assumptions, design, plan, or required operational rules.
11. Run the blueprint validator and resolve structural errors.

## Output summary

Report:

- Core version before and after.
- Files and durable rules changed.
- ADRs created or superseded.
- Distilled operational artifacts refreshed, confirmed current, or marked stale.
- Custom skill plans or custom check workflows updated.
- Active changes assessed and any marked stale.
- Accepted change details intentionally left change-local.

Do not rewrite unaffected core sections merely to improve prose; unnecessary churn makes version impact harder to assess.
