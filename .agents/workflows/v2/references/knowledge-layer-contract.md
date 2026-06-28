# V2 Knowledge Layer Contract

Use this contract when creating, updating, or consuming v2 blueprint knowledge. It defines three different artifact layers with different readers and loading behavior.

## Principle

V2 separates durable system understanding from agent execution instructions.

- The **core layer** is optimized for human review, alignment, onboarding, and durable decision history.
- The **distilled layer** is optimized for AI production agents that need compact, always-loaded rules before editing code.
- The **change layer** is optimized for one requirement implementation: request, design, plan, execution evidence, and independent validation.

Do not force one artifact to serve all three jobs. Rich human documents may be too large for every implementation turn. Compact agent context is too thin to replace architectural review. Change packages must not become permanent system truth until accepted and promoted.

## Layer model

```text
01-core/                 # Human-reviewable source of truth
        |
        v
03-operational/          # Distilled AI-production context and project-local workflows
        |
        v
02-changes/{CHANGE-ID}/  # One requirement implementation blueprint
```

The arrow direction is derivation, not ownership. Core remains canonical. Operational artifacts are generated or manually synchronized summaries of core knowledge. Change packages pin a core version and consume the distilled context, but their accepted durable knowledge must be promoted back through the core-update workflow.

## Core layer

Path: `01-core/`

Audience: humans first, agents second.

Purpose:

- Explain the product, domain, architecture, quality, UX, engineering, repository, and decision context.
- Preserve durable project knowledge with stable IDs and traceability.
- Support review and alignment before implementation.
- Record decisions and rationale without bloating implementation prompts.

Core artifacts may be detailed. They should be readable, structured, and stable, but they are not expected to fit entirely into every production-agent context window.

## Distilled operational layer

Path: `03-operational/`

Audience: AI production agents first, humans second.

Purpose:

- Provide compact always-loaded context for building, changing, and validating the application.
- Convert core knowledge into actionable rules, guardrails, workflows, and checks.
- Point back to canonical core artifacts instead of restating their full content.
- Make project-specific production behavior explicit enough that agents avoid common mistakes before validation.

Default files:

```text
03-operational/
  00-agent-context.md
  01-build-rules.md
  02-validation-rules.md
  03-custom-skill-plan.md
  04-custom-check-workflow.md
```

### `00-agent-context.md`

Always-loaded system summary for implementation agents.

Include:

- Product purpose and non-goals in compact form.
- Most important domain nouns, authority boundaries, and invariants.
- Chosen stack and architecture style.
- Critical module, data, security, UX, and engineering boundaries.
- Current blocking or high-risk unresolved assumptions.
- Links to canonical core sections for deeper reading.

Keep this file short. It should prefer sharp rules over broad explanation.

### `01-build-rules.md`

Project-specific construction rules.

Include:

- How to add backend, frontend, data, UX, and test changes.
- Module ownership and dependency direction.
- Required patterns for tenant isolation, authorization, validation, migrations, error handling, and observability.
- Forbidden shortcuts and out-of-scope behavior.
- When to consult deeper core documents or ADRs.

This file should tell an implementation agent how to build in this project, not re-explain why the project exists.

### `02-validation-rules.md`

Project-specific validation expectations.

Include:

- Required checks by change type.
- Security, privacy, tenant-isolation, data-integrity, accessibility, and regression checks.
- Evidence required for acceptance.
- Conditions that require independent review or deeper inspection.
- Known high-risk areas that custom validators should inspect.

This file should complement the generic validation contract with project-specific evidence rules.

### `03-custom-skill-plan.md`

Backlog and specification for project-local skills.

Include:

- Candidate skills to create, such as backend feature construction, UI construction, API design, migration design, or validation review.
- Trigger conditions for each skill.
- Inputs each skill must read.
- Outputs each skill must produce.
- Core artifacts and operational rules each skill must obey.

Do not create a skill just to duplicate a static core document. Create skills for repeatable procedures.

### `04-custom-check-workflow.md`

Project-specific check workflow design.

Include:

- Deterministic checks that should become scripts.
- Semideterministic review checks that require model judgment.
- Commands, fixtures, and evidence paths once known.
- Gaps where the repository cannot yet support a check.
- Escalation rules for security, data, production, or compliance concerns.

This artifact is the bridge between blueprint expectations and actual validators or CI gates.

## Change layer

Path: `02-changes/{CHANGE-ID}/`

Audience: agents and reviewers working on one requirement.

Purpose:

- Preserve the original request and scope.
- Classify risk and implementation depth.
- Analyze impact against the pinned core and distilled operational rules.
- Produce implementation-specific specification, design, plan, execution log, and validation report.
- Keep feature-local decisions and evidence out of the core until accepted.

Change packages may reference the distilled layer for operational rules, but they must cite the core layer for durable truth and version pinning.

## Synchronization rules

Core is canonical. Distilled operational artifacts must be refreshed when a core change affects:

- Product non-goals, scope boundaries, or product dependencies.
- Domain concepts, authority, rules, states, or ownership.
- Architecture style, stack, modules, data ownership, contracts, trust boundaries, deployment, or ADRs.
- Quality gates, security expectations, privacy posture, accessibility, performance, reliability, or observability.
- UX conventions, semantic tokens, interaction rules, or content behavior.
- Engineering commands, migrations, CI gates, rollout, rollback, or evidence requirements.
- Repository structure, module ownership, generated files, or test locations.

When a change is accepted:

1. Promote durable knowledge to `01-core/` when appropriate.
2. Update or confirm `03-operational/` when the promoted knowledge changes production-agent behavior.
3. Update custom skill plans or check workflows when the new knowledge changes repeatable work.
4. Increment core version when downstream interpretation can change.
5. Assess active change packages for staleness.

## Loading policy

Default production-agent context should load:

- `03-operational/00-agent-context.md`
- Relevant sections of `03-operational/01-build-rules.md`
- Relevant sections of `03-operational/02-validation-rules.md`
- The active change package.
- Only the core sections needed for the current task.

Do not load every core artifact by default. Use the distilled layer as the always-loaded guide and core artifacts as canonical references on demand.

## Validation policy

Validation must inspect:

- The original request and active change package.
- The pinned core version.
- The relevant distilled operational rules.
- The actual repository diff and reproducible evidence.

If the distilled layer conflicts with the core layer, core wins and the distilled artifact must be marked stale or updated.
