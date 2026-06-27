---
description: Converts complete or incomplete raw software requirements into a normalized v2 change request with stable IDs, observable acceptance criteria, assumptions, open questions, and initial lifecycle state. Use whenever new work enters the AI-SWE process.
---

# Ingest Requirement V2

Preserve the user's intent while making the request safe to design and implement.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Create:

- `02-changes/{CHANGE-ID}/01-request.md`
- `02-changes/{CHANGE-ID}/00-status.json`
- Requirement nodes and source edges in `99-traceability.json`

## Process

1. Preserve the raw requirement verbatim in `01-request.md` or link to an immutable supplied artifact.
2. Assign a stable change ID and requirement IDs. Reuse supplied IDs when valid and unambiguous.
3. Normalize the request into problem, desired outcome, in-scope behavior, exclusions, constraints, and observable acceptance criteria.
4. Inspect the core blueprint and repository for discoverable answers.
5. Separate facts, assumptions, decisions, and open questions.
6. Classify questions using the lifecycle contract.
7. Ask the smallest grouped set of blocking questions. For non-blocking gaps, choose a reversible default and record it.
8. Set state to `clarified` when the intake gate passes; otherwise set `blocked` and list the blocking decisions.

## `01-request.md` sections

1. Raw request
2. Problem and desired outcome
3. Normalized requirements with stable IDs
4. Acceptance criteria mapped to requirement IDs
5. Scope exclusions
6. Constraints and dependencies
7. Facts and repository evidence
8. Assumptions with impact and reversibility
9. Open questions with blocking classification
10. Initial risks

## Acceptance criteria rules

- Describe observable outcomes, not implementation tasks.
- Cover relevant success, failure, empty, boundary, permission, and compatibility behavior.
- Avoid arbitrary detail unsupported by the request or core blueprint.
- Make each criterion independently referenceable.

## Quality gate

- The normalized request does not silently expand scope.
- Every active criterion traces to at least one requirement.
- Blocking uncertainty is explicit.
- A later validator can determine pass or fail from the criteria.
