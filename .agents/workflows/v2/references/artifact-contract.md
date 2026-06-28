# V2 Artifact Contract

Use this contract for every v2 workflow. It defines where durable project knowledge, change-specific design, execution state, and validation evidence live.

For the relationship between human core knowledge, distilled AI-production context, and per-requirement change blueprints, also read `.agents/workflows/v2/references/knowledge-layer-contract.md`.

## Root layout

```text
{blueprintDir}/
  00-manifest.json
  01-core/
    01-product.md
    02-domain.md
    03-architecture.md
    04-quality.md
    05-ux-system.md
    06-engineering.md
    07-repository-map.md
    08-decisions/
  02-changes/
    {CHANGE-ID}/
      00-status.json
      01-request.md
      02-classification.md
      03-impact-analysis.md
      04-specification.md
      05-technical-design.md
      06-test-plan.md
      07-implementation-plan.md
      09-execution-log.md
      10-validation-report.md
  03-operational/
    00-agent-context.md
    01-build-rules.md
    02-validation-rules.md
    03-custom-skill-plan.md
    04-custom-check-workflow.md
  99-traceability.json
```

Numeric prefixes are normative and express reading/lifecycle order. Use two digits so lexical directory listings preserve the SDLC cascade. Root metadata is `00`, durable human-reviewable core is `01-core`, per-requirement change packages are `02-changes`, distilled AI-production context is `03-operational`, and cross-artifact traceability is `99`. Core knowledge is `01` through `08`, change status is `00`, and change work products are `01` through `10`. Optional change-local preparation evidence may use the next free number between planning and execution; for example, `08-structural-validation.md`.

Default `blueprintDir` to `.agents/blueprints/{project-slug}`.

## Artifact ownership

| Information | Source of truth |
|:---|:---|
| Product purpose, users, outcomes, scope | `01-core/01-product.md` |
| Domain concepts, entities, invariants, durable rules | `01-core/02-domain.md` |
| Components, boundaries, data flows, integrations | `01-core/03-architecture.md` |
| Security, performance, reliability, accessibility | `01-core/04-quality.md` |
| UX principles, semantic tokens, interaction standards | `01-core/05-ux-system.md` |
| Coding, testing, migration, review, delivery conventions | `01-core/06-engineering.md` |
| Current codebase structure and ownership | `01-core/07-repository-map.md` |
| Durable technical decisions | `01-core/08-decisions/ADR-*.md` |
| One requested modification | `02-changes/{CHANGE-ID}/` |
| Always-loaded AI implementation context | `03-operational/00-agent-context.md` |
| Project-specific build rules for production agents | `03-operational/01-build-rules.md` |
| Project-specific validation rules and evidence expectations | `03-operational/02-validation-rules.md` |
| Candidate project-local skills | `03-operational/03-custom-skill-plan.md` |
| Candidate custom check workflow | `03-operational/04-custom-check-workflow.md` |
| Cross-artifact relationships | `99-traceability.json` |

Reference information owned elsewhere instead of copying it. Record a proposed core change in the change package until `09-skill_update_core_blueprint` accepts it.

Operational artifacts are derived from the core and must not contradict it. If a distilled operational artifact conflicts with a core artifact, the core artifact wins and the operational artifact must be refreshed.

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

For change artifacts and core artifacts other than `01-core/01-product.md` and `01-core/02-domain.md`, preserve these categories whenever reasoning introduces uncertainty. Use explicit sections, artifact-specific sections, or tables, but do not mix the categories together. The domain artifact uses its own unified `Assumptions and open questions` table.

- Facts: directly supplied or verified information.
- Assumptions: reversible defaults made by the agent.
- Decisions: choices approved by the user or established by project policy.
- Open questions: missing information, marked blocking or non-blocking.

Never present an assumption as a fact.

## Product artifact contract

`01-core/01-product.md` is an executive product boundary, not a reasoning log. Use these sections in this order:

1. `Purpose`
2. `Target users`
3. `Outcomes`
4. `Product epics`
5. `Scope boundaries`
6. `Product dependencies`
7. `Product risks`
8. `Unresolved assumptions`, only when unresolved assumptions remain

Do not add `Facts`, `Decisions`, or `Open questions` sections to the product artifact. Source references identify where established information came from. Durable architectural decisions belong in ADRs. Merge unresolved questions into `Unresolved assumptions`.

### Purpose

- Start with `**Problem being solved**:` and explain the current user or business problem, who experiences it, and why the existing situation is insufficient.
- Follow with `**Product purpose**:` and explain how the product addresses that problem and the value it is intended to create.
- Describe the enduring product purpose, not the implementation approach, feature inventory, or current change package.

### Target users

Use a Markdown table with exactly these columns:

| Persona | Description | Key needs | Pain points |
|:---|:---|:---|:---|

- Include every materially different target-user group that affects product behavior or priorities.
- Treat personas as concise role-based user archetypes grounded in supplied or discoverable information. Do not fabricate demographic detail, market research, quotations, or behavioral evidence.
- Describe who the persona is and its context in `Description`, desired outcomes and capabilities in `Key needs`, and current obstacles or frustrations in `Pain points`.

### Product epics

- Represent every known major product capability as an epic. Do not limit the core file to the first implementation slice or only the epics selected for the current change.
- Use a numbered list and give every epic a stable `EPIC-*` ID and descriptive title.
- For each epic, include a `Description` covering the target users, user goal, initiating context, included capability, and successful result.
- For each epic, include `Sample user stories` with one or more stories explicitly prefixed `Sample:`. Use the form “As a …, I want …, so that …” where it fits.
- Sample user stories illustrate intent and decomposition; they are not complete requirements or acceptance criteria. Change packages must refine selected stories before implementation.
- Keep implementation design, screen-by-screen behavior, and low-level feature tasks out of this section.

### Scope boundaries

- Use a numbered list and give every boundary a stable `BOUNDARY-*` ID.
- State what the product deliberately does not support, including adjacent workflows, user groups, channels, content, integrations, operational modes, or fidelity claims that could otherwise be inferred.
- Do not repeat included behavior here; supported behavior belongs in `Product epics`.

### Product dependencies

- Use a numbered list and give every dependency a stable `DEPENDENCY-*` ID.
- Record executive-level dependencies on external products, applications, services, public interfaces, operating platforms, runtime platforms, industry ecosystems, policy authorities, or other outside commitments that materially constrain product scope, availability, compliance, customer value, or go-to-market assumptions.
- For each dependency, state why it is needed and the product impact if it is unavailable or changes materially.
- Do not list generic prerequisites that are true for most software, such as durable storage, a web browser, authentication, network access, hosting, packages, build tools, test libraries, or common runtime platforms, unless the requirement makes a specific dependency product-defining. Those belong in architecture, engineering, or the relevant change package.
- Before adding a dependency, apply this viability test: if the named thing could be swapped during technical design without changing product scope, user promise, regulatory posture, data authority, or external operating model, it is not a product dependency.
- Prefer fewer, sharper dependencies over generic platform inventory. If no materially product-shaping dependencies are known yet, write one explicit entry such as `DEPENDENCY-{SLUG}-001 - No external product dependencies established yet` and state that later architecture or change design may introduce implementation dependencies.

### Product risks

- Use a Markdown table with exactly these columns:

| Risk ID | Risk | Probability | Impact | Rationale | Product impact | Watch/response |
|:---|:---|:---|:---|:---|:---|:---|

- Give every risk a stable `RISK-*` ID and concise descriptive name.
- Use simple probability and impact values: `Low`, `Medium`, or `High`. Use the current requirement evidence and reasonable domain judgment; do not imply quantitative precision.
- Order risks by severity: higher impact first, then higher probability. When two risks have the same rating, put the one that could invalidate more product scope earlier.
- Record durable product-level risks that may affect scope, adoption, safety, legal exposure, usability, feasibility, delivery, or long-term quality.
- For each risk, state the risk condition, why it is plausible, the product impact if it materializes, and at least one watch signal or response path.
- To ensure risks are thought out, scan at least these categories before finalizing: user adoption and workflow fit, data authority and privacy, security and abuse, legal or compliance exposure, scope creep, dependency or ecosystem shifts, operational feasibility, accessibility and usability, migration or data quality, and delivery complexity. Include only categories that create durable product-level risk; do not manufacture filler rows.
- Keep implementation-task risks in the relevant change package unless they are durable across changes.

### Unresolved assumptions

- Include only unresolved propositions that could change a product epic or scope boundary.
- Give every assumption a stable `ASSUMPTION-*` ID and classify it as `blocking` or `non-blocking`.
- Record the current proposition, why it matters, how it will be validated or invalidated, and the target epic or boundary that will absorb the result. Update a related product dependency at the same time when applicable.
- A blocking assumption makes the artifact `blocked` and prevents progression past core initialization.
- A non-blocking assumption requires a safe reversible default and a named lifecycle gate or event by which it must be resolved.
- Once resolved, remove it from this section and update the target normative entry. Do not retain resolved assumptions as product history.

## Domain artifact contract

`01-core/02-domain.md` is the shared language and business-rule map for the software's problem space. It applies to all software domains, including SaaS products, internal tools, APIs, data systems, developer platforms, automation workflows, and games. It is not an architecture diagram, database schema, implementation plan, or exhaustive feature specification.

Do not use the domain artifact as a more detailed copy of the product artifact. The product artifact owns market-facing purpose, target users, product outcomes, product epics, product scope boundaries, product dependencies, and product risks. The domain artifact owns shared nouns, domain-specific meanings, rules, authority, states, events, and modeling guardrails. Reference product boundaries only when needed to prevent an invalid domain concept, actor, state, event, authority, or invariant from being introduced later.

Use software-neutral, human-readable sections in this order:

1. `Purpose`
2. `Core concepts and entities`
3. `Out-of-scope domain concepts`
4. `Relationships`
5. `States and transitions`
6. `Domain events`
7. `Core rules and constraints`
8. `Ownership, authority, and boundaries`
9. `Assumptions and open questions`
10. `Generation stop conditions`

### Purpose

- Explain why the domain artifact exists for this project.
- State what kinds of future AI or human decisions it is meant to constrain.
- Do not describe implementation technology unless the technology is itself domain-significant.

### Core concepts and entities

- Start with the vocabulary a reader needs before they can understand rules, states, or authority.
- Use a Markdown table with columns `Concept`, `Type`, `Meaning`, and `Why it matters`.
- Use `Type` values such as `Actor`, `Entity`, `Relationship entity`, `Value object`, `State`, `Event`, `Policy`, or `Record`.
- Define source-backed domain facts through the concepts themselves instead of adding a separate product-like context summary.
- Do not restate product purpose, target users, product epics, broad scope boundaries, risks, dependencies, or implementation approach. If a supplied fact is already captured as a product promise and does not constrain domain modeling, leave it in `01-product.md`.

### Out-of-scope domain concepts

- Record adjacent domain concepts, actors, states, events, decisions, or authorities the software deliberately does not model, automate, expose, store, or decide.
- Include an exclusion only when future work might otherwise introduce a domain model element that conflicts with the product boundary.
- Do not copy the product artifact's scope boundaries into this section. Product exclusions such as channels, platforms, broad features, or go-to-market scope remain in `01-product.md` unless they imply a specific prohibited domain concept.
- Prefer domain-language exclusions over product, UX, platform, or implementation exclusions.

### Relationships

- Make relationships explicit so readers do not infer cardinality, ownership, or attachment rules from scattered prose.
- Use a Markdown table with columns `Relationship ID`, `From`, `Relationship`, `To`, `Cardinality`, and `Meaning`.
- Use stable `REL-*` IDs when relationships are materially referenced by rules, tests, or validation.
- Include ownership, association, membership, attachment, status, and authority relationships when they affect behavior, access, data integrity, or lifecycle.

### States and transitions

- Include only domain objects whose status or progression materially affects behavior, authorization, data integrity, or user outcomes.
- For each stateful concept, list valid states, allowed transitions, terminal states, and the meaning of each state.
- Do not invent lifecycle depth for concepts that do not need it yet.

### Domain events

- Record meaningful domain milestones, audit events, workflow events, integration events, or test-observable events.
- Use a Markdown table with columns `Event`, `Source`, `When it occurs`, `Meaning`, and `External contract`.
- Mark internal implementation events as optional unless they are required by the domain.

### Core rules and constraints

- Record durable rules, invariants, permissions, eligibility rules, calculations, limits, ordering constraints, compliance constraints, and reproducibility constraints.
- Use stable `RULE-*` IDs for rules that future requirements, tests, or validation may reference.
- Use a Markdown table with columns `Rule ID`, `Applies to`, `Rule`, and `Rationale`.
- Link each rule through `Applies to` to a concept, entity, relationship entity, relationship, state, event, policy, or boundary named earlier in the domain artifact.
- State rules as obligations or prohibitions that can be checked. Avoid implementation tasks.

### Ownership, authority, and boundaries

- State who or what is allowed to create, modify, approve, resolve, delete, or interpret important domain objects.
- Include human roles, system actors, external systems, automated policies, and validation authority when relevant.
- Use this section to prevent future agents from assigning authority implicitly.
- Include domain boundaries that are about data ownership, authority, lifecycle control, interpretation, and permitted decisions. Keep market/product scope in `01-product.md`.

### Assumptions and open questions

- Use one unified Markdown table with columns `ID`, `Type`, `Importance`, `Applies to`, `Current position`, `Why it matters`, and `Resolution path`.
- `Type` must be `Assumption` or `Question`.
- `Importance` must be `Blocking`, `High`, `Medium`, or `Low`. Use `Blocking` only when the uncertainty must stop downstream generation.
- Record temporary reversible defaults and unresolved questions together so readers see both the current working position and the remaining uncertainty.
- Do not hide a non-blocking question inside prose; if the work proceeds with a default, record the default as the current position and explain when it must be revisited.

### Generation stop conditions

- List conditions that must stop downstream blueprint generation or implementation planning until answered.
- Use a Markdown table with columns `Condition`, `Status`, `Why it stops generation`, and `Current assessment`.
- Mark the current status for each condition as `Clear` or `Blocked`.
- Stop when unresolved uncertainty would materially change domain structure, data ownership, authority, lifecycle meaning, privacy or compliance posture, irreversible scope, or public behavior.
- If any condition is `Blocked`, the domain artifact status must be `blocked`, and downstream lifecycle stages must not proceed beyond the current gate.

## Architecture artifact contract

`01-core/03-architecture.md` is the durable technical map for the system. It describes architecture drivers, constraints, style, stack options, major views, component and module responsibilities, dependency direction, data ownership, integration contracts, trust boundaries, deployment topology, technical risks, tradeoffs, and accepted architectural decisions. It is not a product promise, domain model, task plan, quality checklist, engineering playbook, or repository directory listing.

Use these sections in this order:

1. `Purpose`
2. `Architecture context`
3. `Architecture drivers and constraints`
4. `Architecture style and options`
5. `Architecture views`
6. `Runtime components and modules`
7. `Boundaries and dependency rules`
8. `Data architecture`
9. `Integration architecture`
10. `Trust boundaries and security posture`
11. `Deployment and operational topology`
12. `Architecture risks and tradeoffs`
13. `Architecture decisions`
14. `Assumptions and open questions`
15. `Generation stop conditions`

### Purpose

- Explain what technical system this artifact describes and what future design, implementation, testing, and validation decisions it constrains.
- State whether the artifact reflects verified current state, intended target state, or a mix of both.
- Reference product and domain artifacts only to explain technical constraints; do not restate product epics or domain rules.

### Architecture context

- Summarize the system type, runtime shape, main actors or entry points, and known external systems.
- Identify the main use cases or user journeys that justify the architecture. Keep this to architecture-driving use cases, not the full product backlog.
- For brownfield projects, cite repository evidence for current architecture claims, such as configuration, entry points, schemas, API contracts, deployment files, tests, or package manifests.
- For greenfield or partial projects, label context as intended, assumed, or undecided.
- Explicitly separate current verified architecture from future target architecture when they differ.

### Architecture drivers and constraints

Use compact tables or short lists to record the forces that shape the architecture.

- Include architecture-driving use cases, quality-attribute priorities, team skills, delivery constraints, budget or operational constraints, regulatory or privacy constraints, external-system constraints, and technology constraints when they materially apply.
- State `Optimizes for` and `Does not optimize for yet` so future work does not over-design for unneeded scale, integration volume, analytics depth, compliance depth, portability, or platform abstraction.
- Quality attributes may be prioritized here, but measurable targets, test methods, and acceptance thresholds belong in `04-quality.md`.
- Use stable `DRIVER-*` IDs for drivers that explain architecture choices or ADRs.

### Architecture style and options

- State the selected or recommended architecture style, such as modular monolith, layered monolith, event-driven system, microservices, serverless, data pipeline, plugin architecture, desktop application, game client, or embedded system.
- Explain why the style fits the architecture drivers and what it trades off.
- If stack or style is not fully accepted, include a compact recommendation table with `Option ID`, `Option`, `Fit`, `Strengths`, `Tradeoffs`, and `Recommendation`. Use stable `STACK-*` or `ARCH-OPTION-*` IDs.
- Name explicit split or evolution conditions. For example, when a modular monolith should split into services, when a queue should be introduced, or when a managed platform dependency becomes justified.
- Route material choices to `Architecture decisions`; do not bury irreversible stack or topology choices in prose.

### Architecture views

- Include compact C4-style views when useful: system context, container/deployable view, and optionally a module/layer view.
- Mermaid diagrams are preferred for compactness and maintainability. Keep diagrams small enough to fit on one screen.
- Pair each diagram with one short paragraph explaining what the view is meant to constrain.
- Do not use diagrams to introduce components, external systems, or data flows that are not also represented in the relevant component, data, integration, or trust-boundary sections.

### Runtime components and modules

Use a Markdown table with columns `Component ID`, `Component`, `Type`, `Responsibility`, `Owns`, `Inbound contracts`, `Outbound dependencies`, and `Status/evidence`.

- Use stable `COMPONENT-*` IDs for material runtime components, libraries, stores, external systems, workers, or infrastructure pieces.
- `Type` should use concise values such as `UI`, `API`, `Service`, `Worker`, `Library`, `Data store`, `External system`, `Infrastructure`, or `Test harness`.
- `Responsibility` should describe what the component is accountable for, not its implementation tasks.
- `Owns` should identify technical ownership such as data, state, API surface, business capability enforcement, rendering concern, job execution, or infrastructure responsibility.
- `Inbound contracts` and `Outbound dependencies` should name contracts or dependency targets, not vague words such as "frontend" or "backend" when a sharper name is known.
- `Status/evidence` should distinguish `Verified`, `Intended`, `Assumed`, or `Undecided`; include repository paths or source references when verified.
- Add a compact module table when internal module boundaries, ownership, extension points, or future split points matter. Use stable `MODULE-*` IDs.

### Boundaries and dependency rules

- Record architectural boundaries that future work must preserve, including layering, module ownership, allowed dependency direction, forbidden imports, runtime isolation, data access, and test boundaries.
- Use stable `ARCH-BOUNDARY-*` or `ARCH-RULE-*` IDs when a boundary will be referenced by changes, tests, validation, or ADRs.
- State rules as obligations or prohibitions that can be checked through code review, static analysis, tests, or validation.
- Include concrete major violation examples under the relevant boundary or rule when mistakes are plausible. Each example should name the bad design, why it violates the boundary, and where it should be caught. Prefer examples that production agents might otherwise accidentally implement, such as direct UI-to-database access, skipped authorization, controller-owned domain rules, cross-module persistence writes, direct third-party calls from the wrong layer, or infrastructure dependencies inside domain modules.
- Do not duplicate product scope boundaries or domain invariants. Reference them only when describing where they are enforced technically.

### Data architecture

- Record technical sources of truth, data stores, schema areas, ownership keys, tenant boundaries, transaction boundaries, caches, derived data, imports, exports, retention-sensitive movement, audit-relevant flows, migrations, backup/recovery assumptions, and reporting or analytics separation when relevant.
- Use stable `DATA-*` or `FLOW-*` IDs for material data stores or flows.
- For each material flow, identify source, destination, triggering action, data class, trust or tenant boundary crossed, persistence behavior, and failure handling when known.
- Keep domain-level ownership in `02-domain.md`; architecture owns how that ownership is enforced in storage, APIs, services, events, and infrastructure.

### Integration architecture

- Record public APIs, internal module contracts, external service contracts, event contracts, webhooks, file formats, browser or platform APIs, and compatibility requirements that shape implementation.
- Use stable `CONTRACT-*` IDs for contracts that requirements, tests, validation, or ADRs may reference.
- For each contract, identify provider, consumer, format or protocol, versioning expectation, compatibility rule, error behavior, and evidence or status when known.
- Record integration rules that govern future additions, such as when an external service may be introduced, how adapters isolate third-party systems, how retries and idempotency are handled, and how external contracts are versioned.
- Keep speculative integrations out of the component model unless the product or an accepted change has made them durable. Mention excluded integration categories as rules when product boundaries make them important.

### Trust boundaries and security posture

- Identify security-relevant boundaries across users, organizations, processes, browsers, servers, networks, data stores, external systems, secrets, credentials, and personal or sensitive data.
- Use stable `TRUST-*` IDs for trust boundaries that need explicit design or validation.
- State how authentication, authorization, tenant isolation, input validation, output encoding, secret handling, and auditability are expected to be enforced when known.
- If a sensitive boundary is not yet designed, record it as an assumption or open question and assess whether it blocks generation.

### Deployment and operational topology

- Record runtime environments, deployable units, build artifacts, hosting model, configuration sources, background jobs, scheduled tasks, storage services, observability paths, backup or recovery expectations, and local development topology.
- Distinguish local development, test, staging, and production topology when materially different.
- For brownfield projects, cite deployment, infrastructure, environment, or CI files as evidence.
- Do not duplicate engineering commands or repository path inventories; those belong in `06-engineering.md` and `07-repository-map.md`.
- Include operations-facing expectations that architecture must enable, such as health checks, logs, metrics, tracing, migrations, incident diagnosis, rollback hooks, and environment separation. Detailed CI/CD and evidence commands belong in `06-engineering.md`.

### Architecture risks and tradeoffs

Use a Markdown table with columns `Risk ID`, `Risk or tradeoff`, `Why accepted or plausible`, `Impact`, `Mitigation or watch signal`, and `Carries forward to`.

- Use stable `ARCH-RISK-*` IDs.
- Include only technical architecture risks and tradeoffs, not product adoption risks already owned by `01-product.md`.
- Cover risks introduced by style, stack, data ownership, security posture, integration choices, deployment topology, team skills, cost exposure, migration strategy, and operational complexity when they materially apply.
- Link each row to an ADR, quality attribute, boundary, assumption, or future change where it must be resolved or watched.

### Architecture decisions

- List accepted architectural decisions with stable `ADR-*` references and a one-sentence consequence.
- Include a concise ADR backlog for material unresolved choices, such as architecture style, stack selection, deployment topology, authentication, tenant isolation strategy, migration strategy, external integration policy, observability, and data-retention approach when they apply.
- Store material decision records under `01-core/08-decisions/ADR-*.md`.
- Do not create ADRs for obvious framework defaults, temporary implementation details, or choices still under consideration.
- If no architectural decisions are accepted yet, state that explicitly.

### Assumptions and open questions

- Use one unified Markdown table with columns `ID`, `Type`, `Importance`, `Applies to`, `Current position`, `Why it matters`, and `Resolution path`.
- `Type` must be `Assumption` or `Question`.
- `Importance` must be `Blocking`, `High`, `Medium`, or `Low`. Use `Blocking` only when the uncertainty must stop downstream generation.
- Record reversible defaults as assumptions with a named gate where they must be revisited.
- Do not present unverified technical guesses as facts in component, data, contract, or topology sections.

### Generation stop conditions

- Use a Markdown table with columns `Condition`, `Status`, `Why it stops generation`, and `Current assessment`.
- Mark each condition as `Clear` or `Blocked`.
- Stop when unresolved uncertainty would materially change component boundaries, data ownership, trust boundaries, deployment topology, integration contracts, irreversible technology choices, migration strategy, security or compliance posture, production authority, cost exposure, or public behavior.
- If any condition is `Blocked`, the architecture artifact status must be `blocked`, and downstream design or implementation planning must not proceed beyond the current gate.

## Machine-readable files

`00-manifest.json` must contain:

```json
{
  "schema_version": 2,
  "project_slug": "example",
  "core_version": 1,
  "lifecycle_status": "active",
  "updated_at": "YYYY-MM-DD"
}
```

`00-status.json` must contain:

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

`99-traceability.json` must contain unique nodes and valid edges:

```json
{
  "schema_version": 2,
  "nodes": [
    {
      "id": "REQ-EXAMPLE-001",
      "type": "requirement",
      "title": "Example requirement",
      "status": "active",
      "source": "02-changes/CHANGE-EXAMPLE-001/01-request.md"
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

Preferred ID prefixes are `CHANGE`, `OUTCOME`, `EPIC`, `BOUNDARY`, `DEPENDENCY`, `RISK`, `ASSUMPTION`, `QUESTION`, `REL`, `REQ`, `RULE`, `DRIVER`, `STACK`, `ARCH-OPTION`, `COMPONENT`, `MODULE`, `ARCH-BOUNDARY`, `ARCH-RULE`, `DATA`, `FLOW`, `CONTRACT`, `TRUST`, `ARCH-RISK`, `NFR`, `ADR`, `TEST`, `TASK`, `CODE`, `EVIDENCE`, and `FINDING`. Preserve IDs across revisions; mark obsolete nodes superseded instead of renumbering them.

## Change profiles

| Artifact | Patch | Feature | Initiative |
|:---|:---:|:---:|:---:|
| `01-request.md` | Required | Required | Required |
| `00-status.json` | Required | Required | Required |
| `02-classification.md` | Required | Required | Required |
| `03-impact-analysis.md` | Required | Required | Required |
| `04-specification.md` | Optional when acceptance criteria are sufficient | Required | Required |
| `05-technical-design.md` | Required for contract, schema, security, or architecture changes | Required | Required |
| `06-test-plan.md` | May be embedded in implementation plan | Required | Required |
| `07-implementation-plan.md` | Required | Required | Required |
| `09-execution-log.md` | Required after execution starts | Required after execution starts | Required after execution starts |
| `10-validation-report.md` | Required for acceptance | Required for acceptance | Required for acceptance |

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
