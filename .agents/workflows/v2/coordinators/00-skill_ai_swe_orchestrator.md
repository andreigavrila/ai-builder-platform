---
description: Orchestrates the v2 AI software-engineering lifecycle from incomplete requirements through core blueprinting, change design, implementation, independent validation, and durable blueprint updates. Use to start, resume, or inspect an end-to-end project or change workflow.
---

# AI-SWE Lifecycle Orchestrator V2

Coordinate preparation, execution, and validation without reproducing specialist artifacts yourself.

## Shared contracts

Read before acting:

- `.agents/workflows/v2/references/blueprint-authoring-philosophy.md`
- `.agents/workflows/v2/references/artifact-contract.md`
- `.agents/workflows/v2/references/lifecycle-contract.md`
- For validation routing, `.agents/workflows/v2/references/validation-contract.md`

## Inputs

- A project slug or `blueprintDir`.
- Any combination of high-level requirements, partial requirements, an existing blueprint, and an existing repository.
- An optional change ID when resuming work.

## Routing

1. Classify the user's input as project-foundation material, a concrete change request, or both. Ask only when the distinction materially changes the requested outcome.
2. If the core blueprint does not exist, run `01-skill_initialize_core_blueprint` using project-foundation material. Do not automatically turn the entire product vision into one implementation change.
3. If initial implementation is requested, extract the smallest agreed release slice into an initiative or feature request and run `02-skill_ingest_requirement` for that slice.
4. If the core exists and the user supplied a concrete modification, run `02-skill_ingest_requirement`.
5. If the change has no profile, run `03-skill_classify_change`.
6. If impact is unknown or stale, run `04-skill_analyze_impact`.
7. Run `05-skill_design_change` for artifacts required by the profile and risk.
8. Run `06-skill_plan_implementation` after the specification gate passes.
9. Run `07-skill_execute_implementation` after the planning gate passes and implementation is authorized.
10. Run `08-skill_validate_implementation` from the original request and actual repository state.
11. Route `changes-required` findings back to execution, then validate again.
12. After acceptance, run `09-skill_update_core_blueprint` only when the change introduced durable project knowledge.

Invoke specialist workflows directly when the environment supports workflow composition. Otherwise execute their instructions in the current session; do not make the user manually relay unchanged artifacts between stages.

## Resume protocol

1. Read `00-manifest.json`, the selected `00-status.json`, and relevant nodes in `99-traceability.json`.
2. Verify that required artifacts exist and that the change's `core_version` is current.
3. Detect the last passed quality gate from evidence, not merely the state string.
4. Resume from the first incomplete or stale gate.
5. Preserve existing IDs and artifact history.

## Control rules

- Keep the core blueprint durable and change packages local to one modification.
- Read only relevant core sections and impacted code; do not load every artifact by default.
- Ask only blocking questions defined by the lifecycle contract.
- Never infer authorization for deployment, production mutation, destructive migration, external communication, or source-control publication.
- Do not mark a change accepted; only independent validation can do that.
- When upstream requirements or core decisions change, mark affected downstream artifacts `stale` before continuing.

## User updates

At meaningful transitions report:

- Current change ID, profile, and state.
- Gate just passed or failed.
- Blocking decisions, if any.
- Next action and expected artifact.

Avoid asking for approval at every stage. Pause only for blocking decisions or actions requiring new authority.

## Completion

The lifecycle is complete when:

- Validation verdict is `accepted` or `accepted-with-notes`.
- `00-status.json` is `accepted`.
- Traceability reaches implementation and evidence nodes for every active acceptance criterion.
- Durable knowledge is either merged into the core blueprint or explicitly recorded as change-local.
