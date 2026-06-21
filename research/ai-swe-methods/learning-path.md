# Comparison and Learning Path

The goal is to learn from these methods using comparable evidence, not merely read their marketing material.

## Phase 1: Understand the major design choices

Study in this order:

1. **OpenSpec** — the smallest useful change-package model.
2. **Spec Kit** — specification-driven requirements, planning, and consistency checks.
3. **Conductor** — durable project context plus per-change tracks.
4. **GSD Core** — context isolation, verification, and phase shipping.
5. **Superpowers** — implementation discipline, TDD, and layered review.
6. **AI-DLC** — adaptive full-lifecycle governance.
7. **BMAD** — broad specialist-agent and product-development orchestration.

This sequence progresses from lightweight artifacts to full lifecycle systems, making their tradeoffs easier to isolate.

## Phase 2: Create method cards

For every method, record:

- Intended users and project size.
- Greenfield and brownfield support.
- Lifecycle states and transitions.
- Required and optional artifacts.
- Source-of-truth policy.
- Human decisions and approval points.
- Agent roles and context boundaries.
- Requirements and NFR handling.
- Implementation and testing behavior.
- Validation authority and evidence.
- Change archival and durable knowledge updates.
- Recovery, resume, and stale-work behavior.
- Tool/model coupling.
- Installation and operational overhead.
- Failure modes observed during use.

## Phase 3: Run a controlled comparison

Use the same repository and the same three requests with every viable method:

1. **Patch:** a small but security-sensitive defect.
2. **Feature:** a bounded feature affecting UI, API, data, and tests.
3. **Initiative:** a cross-component change with architecture, migration, NFR, and rollout consequences.

Keep the original request and repository revision fixed. Use comparable models where the method permits it.

Measure:

- Number and relevance of questions.
- Time and tokens before implementation begins.
- Missing or invented requirements.
- Artifact consistency.
- Requirement and edge-case coverage.
- Unnecessary ceremony for the patch.
- Architecture and repository-rule compliance.
- Tests and verification actually executed.
- Defects found by an independent assessor.
- Ability to resume in a fresh context.
- Quality of durable knowledge after acceptance.
- User interventions required.

## Phase 4: Compare artifacts, not claims

For each run, preserve:

```text
experiments/
  {method}/
    {scenario}/
      request.md
      environment.md
      generated-artifacts/
      execution-log.md
      validation-report.md
      observations.md
      metrics.json
```

Do not score a documented capability as successful unless the experiment produces evidence for it.

## Phase 5: Decide what to adopt

Classify every candidate idea as:

- **Adopt:** compatible with V2 and demonstrably improves outcomes.
- **Adapt:** useful but needs stronger ownership, evidence, or lifecycle semantics.
- **Observe:** promising but insufficiently tested.
- **Reject:** conflicts with V2's safety, traceability, or context-efficiency goals.

Initial hypotheses worth testing:

- Agent OS can improve core blueprint initialization for brownfield repositories.
- GSD's fresh-context model can reduce execution degradation.
- Superpowers' two-stage review can sharpen V2 validation routing.
- OpenSpec can improve change-package ergonomics without weakening gates.
- Spec Kit's cross-artifact analysis can become a stronger specification gate.
- AI-DLC extensions can inform reusable organization-specific policies.
