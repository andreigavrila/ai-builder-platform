# V2 Independent Validation Contract

Validate implementation independently from the executor's narrative. Treat plans and execution logs as leads, not proof.

## Required inputs

- Original normalized request and acceptance criteria.
- Core blueprint version pinned by `00-status.json`.
- Classification, impact analysis, specification, design, and test plan required by the profile.
- Actual repository diff and current files.
- Test, build, lint, migration, benchmark, or inspection results.
- Execution log, including deviations and unavailable checks.

## Validation dimensions

Apply dimensions according to risk and mark non-applicable dimensions with a reason.

1. Requirements conformance: observable behavior and exclusions.
2. Functional correctness: rules, boundaries, errors, state transitions, authorization, and concurrency.
3. Architecture conformance: boundaries, dependencies, contracts, data ownership, and ADRs.
4. Quality attributes: performance, reliability, accessibility, compatibility, observability, and maintainability.
5. Security and privacy: trust boundaries, validation, access control, secret handling, sensitive data, and abuse cases.
6. Test quality: requirement coverage, meaningful assertions, isolation, determinism, and regression protection.
7. Delivery safety: migrations, backward compatibility, rollout, rollback, configuration, and operational readiness.
8. Repository quality: build health, static checks, dead code, documentation impact, and unrelated changes.

## Finding model

Use stable finding IDs such as `FINDING-CHANGE-EXAMPLE-001-01`.

For each finding record:

- Severity: blocker, high, medium, low, or note.
- Status: open, resolved, accepted-risk, or false-positive.
- Evidence: file, line, command output, test, or reproducible observation.
- Requirement or core rule affected.
- Concrete remediation and verification method.

## Verdict

Use exactly one verdict:

- `accepted`: all required criteria and checks pass.
- `accepted-with-notes`: all required checks pass; only non-blocking recommendations remain.
- `changes-required`: one or more required criteria or checks fail.
- `blocked`: validation cannot finish because required evidence, access, or dependencies are unavailable.

Do not use passing tests alone as proof of acceptance. Do not accept when a required check was skipped without an approved exception.

## Independence rules

- Do not modify implementation while acting as validator.
- Reproduce important claims where safe and practical.
- Inspect the actual diff and relevant surrounding code.
- Include negative evidence and checks that could not be run.
- Return `changes-required` to execution with finding IDs; validate the remediation in a new report revision.
