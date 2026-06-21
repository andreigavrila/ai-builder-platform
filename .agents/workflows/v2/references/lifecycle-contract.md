# V2 Lifecycle and Quality Gates

Apply these gates to every change. A gate is evidence-based: document existence alone is not sufficient.

## Lifecycle

```text
INGESTED -> CLARIFIED -> SPECIFIED -> PLANNED
    -> IMPLEMENTING -> VERIFYING -> ACCEPTED
           |               |
           +---- BLOCKED <-+

Any non-terminal state may become STALE when its pinned core version changes materially.
```

Use `rejected` only when the user or governing policy declines the change. Use `blocked` only when a required decision, dependency, permission, or failing gate prevents safe progress.

## Question policy

Classify every uncertainty:

- Blocking: materially changes scope, externally visible behavior, security, data integrity, cost, irreversible migration, or production operations. Ask before proceeding.
- Non-blocking: has a safe, reversible default. Proceed, record the assumption, and explain its effect.
- Discoverable: can be answered from the repository, blueprint, tests, or available read-only systems. Investigate rather than asking.

Group blocking questions and ask the smallest set needed for the next gate.

## Gates

### Intake gate

- The original request is preserved verbatim or linked immutably.
- Known facts, assumptions, and open questions are separated.
- Acceptance criteria are observable.
- Scope and exclusions are explicit enough to classify the change.

### Specification gate

- Every active requirement has a stable ID.
- Functional behavior covers success, failure, boundary, authorization, and relevant concurrency cases.
- Impacted core rules and NFRs are referenced.
- Proposed interface, data, migration, and UX changes are explicit when applicable.
- No blocking decision remains unresolved.

### Planning gate

- Tasks form independently verifiable vertical slices where practical.
- Each task references requirements and verification evidence.
- Dependencies, risks, rollout, rollback, and required commands are recorded.
- The plan distinguishes authorized implementation work from external or production actions requiring approval.

### Execution gate

- Changes remain within the approved scope.
- Unrelated worktree changes are preserved.
- Required tests, builds, static checks, migrations, and inspections have run or are explicitly marked unavailable.
- Commands and material results are recorded in `execution-log.md`.
- Deviations are classified and recorded; material deviations return the change to design or planning.

### Validation gate

- Validation starts from the original request and pinned core blueprint, not from implementation claims.
- Every acceptance criterion has pass, fail, or not-run status with evidence.
- Architecture, security, NFR, regression, test quality, and operational concerns are assessed according to risk.
- Failed required checks prevent acceptance.
- The validation report distinguishes defects from recommendations.

### Core-update gate

- Only durable, cross-change knowledge enters the core blueprint.
- Feature-local details remain in the change package.
- Changed architectural decisions receive an ADR.
- Core version increments when downstream interpretation can change.
- Open changes pinned to the previous version are assessed for staleness.

## Deviation policy

- Low impact: choose a reversible implementation detail consistent with existing conventions and record it.
- Medium impact: update the change design and plan before continuing.
- High impact: stop and request a decision. High-impact deviations include public contract changes, destructive migrations, security posture changes, significant new dependencies, production mutations, and scope expansion.

## Traceability direction

Maintain meaningful links rather than linking every node to every artifact:

```text
OUTCOME -> EPIC -> REQ -> RULE/NFR -> ADR/DESIGN
    -> TASK -> CODE -> TEST -> EVIDENCE
```

Use edge types such as `decomposes_to`, `constrained_by`, `designed_by`, `implemented_by`, `verified_by`, `produces`, `supersedes`, and `updates`.
