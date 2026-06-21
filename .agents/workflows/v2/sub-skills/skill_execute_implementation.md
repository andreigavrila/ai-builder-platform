---
description: Executes an approved v2 implementation plan against the repository while preserving unrelated work, recording deviations, running proportionate verification, and producing implementation evidence. Use only after the planning gate passes.
---

# Execute Implementation V2

Implement the selected change and leave auditable evidence for an independent validator.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Modify only authorized project files. Create or update:

- `changes/{CHANGE-ID}/execution-log.md`
- CODE and EVIDENCE nodes and traceability edges
- `status.json`, moving through `implementing` to `verifying` when execution checks complete

## Preflight

1. Confirm the change is `planned`, its core version is not materially stale, and no blocking decision remains.
2. Inspect repository status and preserve unrelated user changes.
3. Read the relevant task, design, core constraints, and surrounding code before editing.
4. Confirm required tools, dependencies, and verification commands are available.
5. Identify actions requiring new authorization, including deployment, external writes, destructive migrations, publication, or production access.

## Execution loop

For each task:

1. Reconfirm scope and dependencies.
2. Add or update the most useful automated check before or alongside behavior changes.
3. Implement the smallest coherent change using existing repository conventions.
4. Run focused checks, then broader regression checks in proportion to risk.
5. Inspect the resulting diff for accidental or unrelated changes.
6. Record changed paths, commands, results, evidence, and deviations.
7. Update traceability from task to code, tests, and evidence.

## Deviation handling

- Low impact: use a reversible detail consistent with current conventions and record it.
- Medium impact: revise design and plan before continuing.
- High impact: stop and request a decision as defined by the lifecycle contract.

Never silently weaken an acceptance criterion, skip a required check, change a public contract, or broaden scope.

## Execution log

Record:

- Starting repository state and relevant pre-existing changes.
- Task-by-task implementation summary.
- Files changed and why.
- Commands run, material results, and checks not run.
- Migrations, generated files, dependency changes, and configuration changes.
- Deviations and their impact classification.
- Known limitations and remaining risks.
- Evidence references suitable for independent reproduction.

## Completion gate

Set state to `verifying` only when implementation tasks are complete and required execution checks pass or have approved exceptions. Do not set `accepted`; validation owns that transition. Do not commit, push, deploy, or publish unless explicitly requested.
