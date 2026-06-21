# AI Builder Platform Agent Guide

## Purpose

This repository defines versioned AI software-engineering workflows. The workflows turn high-level or incomplete requirements into durable project blueprints, scoped change specifications, implementation plans, code changes, and independent validation evidence.

The repository contains workflow instructions and their supporting contracts. It is not itself an application implementation.

## Start here

Use the [v2 AI-SWE coordinator](.agents/workflows/v2/coordinators/skill_ai_swe_orchestrator.md) for new work. It determines whether the input describes:

- A project foundation that should initialize or update the core blueprint.
- A concrete change that should enter the change lifecycle.
- Both, in which case it establishes the core first and creates a bounded initial change.

Use [v1](.agents/workflows/v1/) only to reproduce or maintain the original seven-stage, document-oriented blueprint process. V1 is retained for compatibility; v2 is the active design direction.

## Repository layout

```text
.agents/workflows/
  v1/
    coordinators/       # Legacy seven-stage workflow orchestration
    sub-skills/         # Legacy requirements-to-roadmap stages
  v2/
    coordinators/       # End-to-end lifecycle routing and state control
    sub-skills/         # Focused preparation, execution, and validation work
    references/         # Normative artifact, lifecycle, and validation contracts
    scripts/            # Deterministic structural validation
```

### Role boundaries

- Coordinators select and sequence workflows, enforce gates, manage lifecycle state, and report blockers. They do not recreate specialist deliverables.
- Sub-skills own one bounded capability and its artifacts. They do not silently advance unrelated lifecycle stages.
- References are shared normative contracts. Update them when schemas, lifecycle rules, or validation semantics change.
- Scripts provide deterministic checks that should not depend on model judgment.

## V2 lifecycle

```text
Project requirements -> Core blueprint
                             |
Smaller requirement -> Ingest -> Classify -> Impact -> Design -> Plan
                                                        -> Execute -> Validate
                                                                      |
                                                     Durable knowledge -> Core update
```

Lifecycle states are:

```text
ingested -> clarified -> specified -> planned
  -> implementing -> verifying -> accepted
```

Changes may also become `blocked`, `rejected`, or `stale`. Only independent validation may mark an implementation accepted.

## V2 workflow index

| Need | Workflow |
|:---|:---|
| Start or resume an end-to-end lifecycle | [AI-SWE coordinator](.agents/workflows/v2/coordinators/skill_ai_swe_orchestrator.md) |
| Establish durable project knowledge | [Initialize core blueprint](.agents/workflows/v2/sub-skills/skill_initialize_core_blueprint.md) |
| Normalize complete or incomplete requirements | [Ingest requirement](.agents/workflows/v2/sub-skills/skill_ingest_requirement.md) |
| Select patch, feature, or initiative depth | [Classify change](.agents/workflows/v2/sub-skills/skill_classify_change.md) |
| Determine repository and system impact | [Analyze impact](.agents/workflows/v2/sub-skills/skill_analyze_impact.md) |
| Define behavior, technical design, and tests | [Design change](.agents/workflows/v2/sub-skills/skill_design_change.md) |
| Produce traceable implementation tasks | [Plan implementation](.agents/workflows/v2/sub-skills/skill_plan_implementation.md) |
| Modify code and collect execution evidence | [Execute implementation](.agents/workflows/v2/sub-skills/skill_execute_implementation.md) |
| Independently assess the implementation | [Validate implementation](.agents/workflows/v2/sub-skills/skill_validate_implementation.md) |
| Promote durable accepted knowledge | [Update core blueprint](.agents/workflows/v2/sub-skills/skill_update_core_blueprint.md) |

## Blueprint artifacts

V2 blueprints default to:

```text
.agents/blueprints/{project-slug}/
  manifest.json
  traceability.json
  core/
  changes/{CHANGE-ID}/
```

The core blueprint contains durable product, domain, architecture, quality, UX, engineering, repository, and decision knowledge. Each change package contains only the request-specific analysis, design, plan, execution log, and validation report.

Read these contracts before creating or changing v2 artifacts:

1. [Artifact contract](.agents/workflows/v2/references/artifact-contract.md)
2. [Lifecycle contract](.agents/workflows/v2/references/lifecycle-contract.md)
3. [Validation contract](.agents/workflows/v2/references/validation-contract.md) when validating implementations

## Operating rules

1. Preserve the user's raw requirement and distinguish facts, assumptions, decisions, and open questions.
2. Investigate discoverable information before asking the user.
3. Ask only questions that materially affect scope, public behavior, security, data integrity, cost, irreversible operations, or required authority.
4. Use reversible documented defaults for non-blocking uncertainty.
5. Preserve stable IDs across revisions and maintain meaningful traceability from requirements to evidence.
6. Use the smallest adequate profile: `patch`, `feature`, or `initiative`. Profile by risk, not expected line count.
7. Keep feature-local details out of the core blueprint until an accepted change proves they are durable.
8. Preserve unrelated worktree changes. Do not commit, push, deploy, publish, or mutate production unless explicitly authorized.
9. Validation must inspect the original request, pinned core version, actual repository diff, and reproducible evidence. Execution claims are not proof.
10. Mark downstream artifacts stale when an upstream requirement or core decision materially changes their interpretation.

## Validation commands

Check the validator itself:

```powershell
node .agents/workflows/v2/scripts/validate-blueprints.cjs --self-test
```

Validate a complete blueprint:

```powershell
node .agents/workflows/v2/scripts/validate-blueprints.cjs ".agents/blueprints/{project-slug}"
```

Validate one change plus its shared core and traceability data:

```powershell
node .agents/workflows/v2/scripts/validate-blueprints.cjs ".agents/blueprints/{project-slug}" --change "{CHANGE-ID}"
```

## Maintaining the workflow suite

- Keep v1 behavior stable unless a task explicitly targets legacy compatibility.
- Put orchestration and routing behavior in `coordinators/`.
- Put bounded specialist behavior in `sub-skills/`.
- Keep shared rules in `references/`; link to them instead of duplicating them across workflows.
- Give every workflow a precise frontmatter description containing what it does and when it should be selected.
- Prefer risk-based depth over instructions such as “exhaustive,” “everything,” or arbitrary document size targets.
- Update the structural validator when machine-readable contracts change.
- Run the validator self-test and verify internal workflow references before considering workflow changes complete.
