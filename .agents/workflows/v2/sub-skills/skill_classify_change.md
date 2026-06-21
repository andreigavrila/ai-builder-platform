---
description: Classifies an ingested v2 software change as patch, feature, or initiative using scope, architecture, data, security, operational, and uncertainty risk. Use after requirement ingestion to select proportionate blueprint artifacts and validation depth.
---

# Classify Change V2

Choose the smallest change profile that provides adequate control for the actual risk.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Write `changes/{CHANGE-ID}/classification.md` and update `status.json.profile`.

## Classification dimensions

Assess each as low, medium, or high with evidence:

- Behavioral scope and number of acceptance criteria.
- Number of components, repositories, or teams affected.
- Public API, event, schema, or compatibility impact.
- Data migration, integrity, reversibility, and retention impact.
- Authentication, authorization, privacy, secrets, or abuse risk.
- Performance, availability, deployment, and operational impact.
- UX surface and accessibility impact.
- Novel technology or dependency introduction.
- Requirement uncertainty and architectural uncertainty.

## Profile rules

- `patch`: localized, reversible, low-uncertainty work with no material architecture or data-model change.
- `feature`: new or changed user/system capability spanning multiple behaviors or modules, but bounded to an established architecture.
- `initiative`: cross-cutting capability, architectural change, migration program, high-risk security/data work, or work requiring multiple coordinated feature changes.

Escalate the profile when one high-risk dimension requires additional design or validation. Do not downgrade merely because the expected diff is small.

## Output

Record:

- Selected profile and rationale.
- Dimension-by-dimension assessment.
- Required and conditionally required artifacts.
- Required specialist validation dimensions.
- Explicit reasons for any omitted artifact.
- Conditions that would trigger reclassification.

Do not estimate lines of code or use them as a profile criterion.
