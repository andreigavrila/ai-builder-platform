---
description: Independently validates a v2 software implementation against the original request, pinned core blueprint, actual repository diff, tests, architecture, security, quality attributes, and delivery safety. Use after execution and for remediation rechecks.
---

# Validate Implementation V2

Produce an evidence-backed verdict without modifying the implementation.

## Contract and outputs

Read:

- `.agents/workflows/v2/references/artifact-contract.md`
- `.agents/workflows/v2/references/lifecycle-contract.md`
- `.agents/workflows/v2/references/validation-contract.md`

Write or revise `02-changes/{CHANGE-ID}/10-validation-report.md`, add finding and evidence relationships to `99-traceability.json`, and update `00-status.json` according to the verdict.

## Process

1. Reconstruct expected behavior from the raw request, normalized requirements, acceptance criteria, and pinned core version.
2. Determine the required validation dimensions from classification and impact analysis.
3. Inspect the actual diff and relevant surrounding code. Do not rely on the execution summary alone.
4. Run safe, relevant tests, builds, static checks, migrations, benchmarks, and inspections needed to reproduce material claims.
5. Map each acceptance criterion to evidence and a pass, fail, or not-run result.
6. Review architecture, security, NFR, regression, test quality, and delivery safety according to risk.
7. Record stable findings and assign the verdict defined by the validation contract.

## Status transitions

- `accepted` or `accepted-with-notes` verdict: set change state to `accepted`.
- `changes-required`: set change state to `implementing` and route finding IDs back to execution.
- `blocked`: set change state to `blocked` and record the exact missing evidence or permission.

## Validation report

Include:

1. Scope and pinned versions.
2. Verdict and concise rationale.
3. Acceptance-criteria matrix with evidence.
4. Commands and inspections performed.
5. Findings ordered by severity.
6. Required remediation and revalidation scope.
7. Checks not run and residual risk.
8. Core-blueprint update candidates discovered during validation.

## Independence rules

- Do not implement fixes while validating.
- Do not downgrade a failure because the implementation was difficult or mostly complete.
- Do not require unrelated cleanup for acceptance; classify it as a recommendation.
- Do not accept passing tests that fail to exercise the requirement.
- On revalidation, verify the remediation and relevant regressions rather than merely closing findings from the execution narrative.
