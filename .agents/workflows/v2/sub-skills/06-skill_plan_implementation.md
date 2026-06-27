---
description: Converts an accepted v2 change design into an ordered, independently verifiable implementation plan with traceable tasks, commands, risks, rollout, and rollback. Use after the specification gate and before code changes.
---

# Plan Implementation V2

Create an executable delivery plan based on outcomes and dependency boundaries, not arbitrary line counts.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Write `02-changes/{CHANGE-ID}/07-implementation-plan.md`, add task nodes and edges to `99-traceability.json`, and set state to `planned` only after the planning gate passes.

## Planning process

1. Read the request, classification, impact analysis, required design artifacts, core engineering rules, and actual repository conventions.
2. Identify the minimum coherent delivery sequence.
3. Prefer vertical slices that produce observable, testable progress. Use infrastructure-first tasks only when they unblock those slices.
4. Separate implementation, migration, rollout, documentation, and validation preparation.
5. Identify tasks that can run in parallel without conflicting files, contracts, or data.
6. Verify all commands and paths from the repository when possible.

## Task contract

For each `[TASK-*]`, record:

- Objective and user/system outcome.
- Requirement, rule, NFR, and design references.
- In-scope and out-of-scope work.
- Expected artifacts or code areas, without pretending the file list is complete.
- Dependencies and safe parallelization notes.
- Implementation notes and constraints.
- Tests or other evidence to create first or alongside the change.
- Acceptance checks and exact verification commands when known.
- Risk, rollout, rollback, and observability notes where applicable.
- Actions requiring separate user authorization.

## Planning rules

- Do not estimate work from lines of code.
- Do not require TDD for tasks where it adds no value; require evidence appropriate to the risk.
- Do not create a complete future file manifest before implementation.
- Do not hide migrations, configuration, documentation, or cleanup inside broad coding tasks.
- Make material dependencies explicit and detect cycles.
- If planning reveals a design gap, return to design instead of embedding a new architecture decision in a task.

## Quality gate

- Every active requirement and planned test is covered by at least one task or explicit deferral.
- Every task has an observable completion condition.
- The plan includes failure recovery for risky changes.
- The executor can determine what to inspect, change, and verify without being forced to follow stale file predictions.
