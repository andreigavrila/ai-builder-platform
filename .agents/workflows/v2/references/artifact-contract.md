# V2 Artifact Contract

Use this contract for every v2 workflow. It defines where durable project knowledge, change-specific design, execution state, and validation evidence live.

## Root layout

```text
{blueprintDir}/
  manifest.json
  traceability.json
  core/
    product.md
    domain.md
    architecture.md
    quality.md
    ux-system.md
    engineering.md
    repository-map.md
    decisions/
  changes/
    {CHANGE-ID}/
      request.md
      status.json
      classification.md
      impact-analysis.md
      specification.md
      technical-design.md
      test-plan.md
      implementation-plan.md
      execution-log.md
      validation-report.md
```

Default `blueprintDir` to `.agents/blueprints/{project-slug}`.

## Artifact ownership

| Information | Source of truth |
|:---|:---|
| Product purpose, users, outcomes, scope | `core/product.md` |
| Domain concepts, entities, invariants, durable rules | `core/domain.md` |
| Components, boundaries, data flows, integrations | `core/architecture.md` |
| Security, performance, reliability, accessibility | `core/quality.md` |
| UX principles, semantic tokens, interaction standards | `core/ux-system.md` |
| Coding, testing, migration, review, delivery conventions | `core/engineering.md` |
| Current codebase structure and ownership | `core/repository-map.md` |
| Durable technical decisions | `core/decisions/ADR-*.md` |
| One requested modification | `changes/{CHANGE-ID}/` |
| Cross-artifact relationships | `traceability.json` |

Reference information owned elsewhere instead of copying it. Record a proposed core change in the change package until `skill_update_core_blueprint` accepts it.

## Required metadata

Start every Markdown artifact with:

```markdown
# {Title}

- **Artifact ID**: {stable ID}
- **Version**: {integer}
- **Status**: draft | ready | blocked | accepted | superseded
- **Core Version**: {version used}
- **Last Updated**: {ISO-8601 date}
- **Source References**: {IDs or paths}
```

Use these sections whenever reasoning introduces uncertainty:

- Facts: directly supplied or verified information.
- Assumptions: reversible defaults made by the agent.
- Decisions: choices approved by the user or established by project policy.
- Open questions: missing information, marked blocking or non-blocking.

Never present an assumption as a fact.

## Machine-readable files

`manifest.json` must contain:

```json
{
  "schema_version": 2,
  "project_slug": "example",
  "core_version": 1,
  "lifecycle_status": "active",
  "updated_at": "YYYY-MM-DD"
}
```

`status.json` must contain:

```json
{
  "schema_version": 2,
  "change_id": "CHANGE-EXAMPLE-001",
  "profile": "unclassified",
  "state": "ingested",
  "core_version": 1,
  "updated_at": "YYYY-MM-DD",
  "blocking_decisions": []
}
```

Allowed profiles are `unclassified`, `patch`, `feature`, and `initiative`. Use `unclassified` only before classification. Allowed states are `ingested`, `clarified`, `specified`, `planned`, `implementing`, `verifying`, `accepted`, `blocked`, `rejected`, and `stale`.

`traceability.json` must contain unique nodes and valid edges:

```json
{
  "schema_version": 2,
  "nodes": [
    {
      "id": "REQ-EXAMPLE-001",
      "type": "requirement",
      "title": "Example requirement",
      "status": "active",
      "source": "changes/CHANGE-EXAMPLE-001/request.md"
    }
  ],
  "edges": [
    {
      "from": "REQ-EXAMPLE-001",
      "to": "TEST-EXAMPLE-001",
      "type": "verified_by"
    }
  ]
}
```

Preferred ID prefixes are `CHANGE`, `OUTCOME`, `EPIC`, `REQ`, `RULE`, `NFR`, `ADR`, `TEST`, `TASK`, `CODE`, `EVIDENCE`, and `FINDING`. Preserve IDs across revisions; mark obsolete nodes superseded instead of renumbering them.

## Change profiles

| Artifact | Patch | Feature | Initiative |
|:---|:---:|:---:|:---:|
| `request.md` | Required | Required | Required |
| `status.json` | Required | Required | Required |
| `classification.md` | Required | Required | Required |
| `impact-analysis.md` | Required | Required | Required |
| `specification.md` | Optional when acceptance criteria are sufficient | Required | Required |
| `technical-design.md` | Required for contract, schema, security, or architecture changes | Required | Required |
| `test-plan.md` | May be embedded in implementation plan | Required | Required |
| `implementation-plan.md` | Required | Required | Required |
| `execution-log.md` | Required after execution starts | Required after execution starts | Required after execution starts |
| `validation-report.md` | Required for acceptance | Required for acceptance | Required for acceptance |

Profiles control ceremony, not quality. A security-sensitive one-line change can still require technical design and specialist validation.

## Structural validation

Run from the repository root:

```text
node .agents/workflows/v2/scripts/validate-blueprints.cjs "{blueprintDir}"
```

To validate one change while still checking the core blueprint and shared traceability:

```text
node .agents/workflows/v2/scripts/validate-blueprints.cjs "{blueprintDir}" --change "{CHANGE-ID}"
```
