---
description: Creates or reconstructs the durable v2 core blueprint for a greenfield or existing software project. Use before planning changes when product, domain, architecture, quality, UX, engineering, or repository knowledge is missing or unstructured.
---

# Initialize Core Blueprint V2

Create the durable system description used by future change packages.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md`, `.agents/workflows/v2/references/knowledge-layer-contract.md`, and `.agents/workflows/v2/references/lifecycle-contract.md`.

Write under `{blueprintDir}`:

- `00-manifest.json` and `99-traceability.json`.
- All files under `01-core/` defined by the artifact contract.
- Initial distilled operational artifacts under `03-operational/` when enough core knowledge exists to guide production agents.
- ADRs only for material decisions that are actually established.

## Inputs

- Project slug and optional project name.
- Available requirements, product notes, architecture documents, and decisions.
- Existing repository and configuration when this is not greenfield.

## Process

1. Determine whether the project is greenfield, brownfield, or partially specified.
2. For an existing repository, inspect code, configuration, tests, schemas, and deployment files before describing current architecture.
3. Separate current verified state from desired future state.
4. Identify missing information and classify it as discoverable, blocking, or non-blocking.
5. Ask only the blocking questions required to establish product boundaries or irreversible constraints.
6. Produce concise core artifacts with stable IDs and cross-references.
7. Distill the initial operational layer from the core: always-loaded agent context, build rules, validation rules, candidate custom skills, and candidate custom check workflow. Mark any file `draft` or `blocked` when core knowledge is insufficient.
8. Initialize core version `1`; use a higher version only when reconstructing documented history.
9. Run the blueprint validator and resolve structural errors.

## Stable ID convention

Prefix stable numbered IDs with the owning document code so references remain unambiguous across the core. Use `{DOC-PREFIX}-{ID-FAMILY}-{PROJECT-SLUG}-{NNN}` for normal numbered IDs, preserving any artifact-specific suffix already needed for clarity. Examples: `01PROD-EPIC-SIMPLE-ATS-001`, `02DOM-RULE-SIMPLE-ATS-001`, `03ARCHI-DRIVER-SIMPLE-ATS-001`, and `04QUAL-NFR-SIMPLE-ATS-001`.

Default core document prefixes:

- `01-product.md`: `01PROD-*`
- `02-domain.md`: `02DOM-*`
- `03-architecture.md`: `03ARCHI-*`
- `04-quality.md`: `04QUAL-*`
- Later core artifacts should define an equally short document prefix before introducing stable numbered IDs.

## Core artifact requirements

### 01 Product

Create an executive product boundary using the product artifact contract.

- Write a descriptive purpose with an explicit `Problem being solved` statement followed by the `Product purpose`. Explain who experiences the problem, why the current situation is insufficient, how the product addresses it, and the intended value.
- Write target users as a table with `Persona`, `Description`, `Key needs`, and `Pain points`. Include all materially different user groups, using role-based archetypes without inventing market evidence or demographic detail.
- Write every known major product capability as a numbered epic with a stable `01PROD-EPIC-*` ID and title. Each epic must include a description of its users, goal, context, included capability, and successful result, plus explicitly labeled sample user stories. Do not restrict this core view to the initial release change.
- Add each product epic to `99-traceability.json` as an `epic` node and connect relevant outcomes to it.
- Write scope boundaries as a numbered list with stable `01PROD-BOUNDARY-*` IDs. Make exclusions detailed enough to prevent adjacent products, workflows, users, channels, integrations, content, and operating modes from being inferred as in scope.
- Write product dependencies as a numbered list with stable `01PROD-DEPENDENCY-*` IDs. Include only external products, services, interfaces, operating platforms, industry ecosystems, policy authorities, or outside commitments that materially constrain product scope, availability, compliance, customer value, or go-to-market assumptions.
- Exclude generic prerequisites that are true for most software, such as durable storage, a web browser, authentication, network access, hosting, packages, build tools, test libraries, or common runtime platforms, unless the requirement makes a specific dependency product-defining. Put those in architecture, engineering, or the relevant change package instead.
- Apply this viability test before adding each dependency: if the named thing could be swapped during technical design without changing product scope, user promise, regulatory posture, data authority, or external operating model, it is not a product dependency.
- Prefer fewer, sharper dependencies over generic platform inventory. If no materially product-shaping dependencies are known yet, write one explicit numbered dependency stating that no external product dependencies are established yet.
- Write product-level risks as a Markdown table with columns `Risk ID`, `Risk`, `Probability`, `Impact`, `Rationale`, `Product impact`, and `Watch/response`.
- Give every risk a stable `01PROD-RISK-*` ID and concise descriptive name. Use simple `Low`, `Medium`, or `High` probability and impact values, ordered by higher impact first and then higher probability.
- For each risk, state the risk condition, why it is plausible from the requirement or domain, the product impact if it materializes, and at least one watch signal or response path.
- Before finalizing risks, explicitly scan these categories and include only durable product-level risks that genuinely apply: user adoption and workflow fit, data authority and privacy, security and abuse, legal or compliance exposure, scope creep, dependency or ecosystem shifts, operational feasibility, accessibility and usability, migration or data quality, and delivery complexity. Do not add generic filler risks merely to cover every category.
- Do not create `Facts`, `Decisions`, or `Open questions` sections. Merge unresolved questions into `Unresolved assumptions`.
- Keep only unresolved scope-significant assumptions. Give each a stable `01PROD-ASSUMPTION-*` ID, blocking classification, validation method, and target epic or boundary. Resolve each assumption into its target entry, update any related dependency, and then remove it.

### 02 Domain

Create a human-readable domain artifact using the domain artifact contract. Use software-neutral sections that work for any project type: `Purpose`, `Core concepts and entities`, `Out-of-scope domain concepts`, `Relationships`, `States and transitions`, `Domain events`, `Core rules and constraints`, `Ownership, authority, and boundaries`, `Assumptions and open questions`, and `Generation stop conditions`.

- Do not create a more detailed copy of the product artifact. Product owns purpose, target users, outcomes, epics, product scope boundaries, dependencies, and risks. Domain owns shared nouns, domain-specific meanings, relationships, states, rules, authority, events, and modeling guardrails.
- Start with `Core concepts and entities` so readers learn the vocabulary before exclusions, relationships, states, events, rules, or authority. Use a table with `Concept`, `Type`, `Meaning`, and `Why it matters`.
- Use `Out-of-scope domain concepts` only for excluded concepts, actors, states, events, decisions, or authorities that future work might otherwise add to the domain model. Do not copy product scope boundaries into the domain artifact unless a boundary prevents a specific invalid domain model element.
- Add `Relationships` as a table with `Relationship ID`, `From`, `Relationship`, `To`, `Cardinality`, and `Meaning`. Make ownership, membership, association, attachment, status, and authority relationships explicit when they affect behavior or data integrity. Use stable `02DOM-REL-*` IDs for referenced relationships.
- Add `States and transitions` only for domain objects whose status progression matters. Explain valid states, allowed transitions, terminal states, and state meanings.
- Add `Domain events` as a table with `Event`, `Source`, `When it occurs`, `Meaning`, and `External contract`. Keep implementation-only event candidates out unless they are useful test-observable domain milestones.
- Record durable rules and invariants as a table with `Rule ID`, `Applies to`, `Rule`, and `Rationale`. Link `Applies to` to concepts, relationship entities, relationships, states, events, policies, or boundaries named earlier. Use stable `02DOM-RULE-*` IDs.
- Record ownership, authority, and domain boundaries so future agents do not silently decide who may create, modify, approve, resolve, delete, interpret, or see important domain objects.
- Merge assumptions and open questions into one table with `ID`, `Type`, `Importance`, `Applies to`, `Current position`, `Why it matters`, and `Resolution path`. Use stable `02DOM-ASSUMPTION-*` and `02DOM-QUESTION-*` IDs and `Blocking`, `High`, `Medium`, or `Low` importance.
- Add `Generation stop conditions`. Mark each condition `Clear` or `Blocked`. Stop generation and set the domain artifact status to `blocked` when unresolved uncertainty would materially change domain structure, data ownership, authority, lifecycle meaning, privacy or compliance posture, irreversible scope, or public behavior.
- Keep persistence details in architecture unless they are domain-significant.

### 03 Architecture

Create a durable architecture brief using the architecture artifact contract. Use sections in this order: `Purpose`, `Architecture context`, `Architecture drivers and constraints`, `Architecture style and options`, `Architecture views`, `Runtime components and modules`, `Boundaries and dependency rules`, `Data architecture`, `Integration architecture`, `Trust boundaries and security posture`, `Deployment and operational topology`, `Architecture risks and tradeoffs`, `Architecture decisions`, `Assumptions and open questions`, and `Generation stop conditions`.

- Do not create a product, domain, repository-map, or implementation-plan duplicate. Product owns user promise, outcomes, product dependencies, and product risks. Domain owns shared nouns, rules, relationships, states, and authority. Repository map owns path inventory and command locations. Architecture owns technical shape: runtime components, dependency direction, data ownership in systems, contracts, trust boundaries, deployment topology, and accepted technical decisions.
- State whether the artifact describes verified current state, intended target state, or both. For brownfield projects, inspect code, package manifests, configuration, schemas, API definitions, deployment files, tests, and CI before describing current architecture; cite concrete paths or source references in `Status/evidence`.
- Use `Architecture context` to summarize runtime shape, entry points, major actors or clients, external systems, architecture-driving use cases, and the current-vs-target distinction. Label greenfield or partial-project claims as intended, assumed, or undecided.
- Add `Architecture drivers and constraints` before technology inventory. Cover architecture-driving use cases, quality-attribute priorities, team skills, delivery constraints, budget or operational constraints, regulatory or privacy constraints, external-system constraints, and technology constraints when they apply. State what the architecture optimizes for and what it does not optimize for yet. Use stable `03ARCHI-DRIVER-*` IDs for material drivers.
- Add `Architecture style and options`. State the selected or recommended architecture style and justify it through the drivers. When stack, style, cloud, database, or integration approach is not accepted yet, include a compact option table with `Option ID`, `Option`, `Fit`, `Strengths`, `Tradeoffs`, and `Recommendation`. Use stable `03ARCHI-STACK-*` or `03ARCHI-ARCH-OPTION-*` IDs and route material choices to ADRs.
- Add `Architecture views` with compact C4-style Mermaid diagrams when helpful: system context, container/deployable view, and optionally module/layer view. Do not introduce components or flows in diagrams that are missing from the corresponding component, data, integration, or trust-boundary sections.
- Add `Runtime components and modules` as a table with `Component ID`, `Component`, `Type`, `Responsibility`, `Owns`, `Inbound contracts`, `Outbound dependencies`, and `Status/evidence`. Use stable `03ARCHI-COMPONENT-*` IDs for material UI, API, service, worker, library, data-store, external-system, infrastructure, or test-harness components. Add a compact `03ARCHI-MODULE-*` table when internal modules, ownership boundaries, extension points, or future split points matter.
- Write component responsibilities as durable accountability, not task lists. `Owns` should identify technical ownership such as data, state, API surface, rendering concern, business-capability enforcement, job execution, or infrastructure responsibility.
- Add `Boundaries and dependency rules` with stable `03ARCHI-ARCH-BOUNDARY-*` or `03ARCHI-ARCH-RULE-*` IDs where future work, tests, validation, or ADRs may refer to them. Make allowed and forbidden dependencies directional and checkable, especially across UI, domain, application, infrastructure, persistence, integration, and test boundaries. Under the relevant boundary or rule, include concrete major violation examples when boundary mistakes are plausible; explain the bad design, why it violates the boundary, and where it should be caught.
- Add `Data architecture` for sources of truth, stores, schema areas, ownership keys, tenant boundaries, transaction boundaries, caches, derived data, imports, exports, retention-sensitive movement, audit-relevant flows, migrations, backup/recovery assumptions, and reporting or analytics separation when relevant. Use stable `03ARCHI-DATA-*` or `03ARCHI-FLOW-*` IDs where useful. Explain how domain ownership is enforced technically instead of restating the domain rule.
- Add `Integration architecture` for public APIs, internal module contracts, external service contracts, event contracts, webhooks, file formats, browser or platform APIs, compatibility requirements, adapter rules, retry/idempotency expectations, and rules for adding future integrations. Use stable `03ARCHI-CONTRACT-*` IDs for contracts that requirements, tests, validation, or ADRs may reference.
- Add `Trust boundaries and security posture` for actors, organizations, processes, browsers, servers, networks, data stores, external systems, secrets, credentials, personal or sensitive data, and cross-tenant boundaries. Avoid generic "auth" language; state the expected enforcement point when known.
- Add `Deployment and operational topology` for runtime environments, deployable units, build artifacts, hosting model, configuration sources, background jobs, scheduled tasks, storage services, observability paths, health checks, backup or recovery expectations, and local development topology. Keep engineering commands in `06-engineering.md` and path inventories in `07-repository-map.md`.
- Add `Trust boundaries and security posture` with stable `03ARCHI-TRUST-*` IDs for trust boundaries that need explicit design or validation.
- Add `Architecture risks and tradeoffs` as a table with `Risk ID`, `Risk or tradeoff`, `Why accepted or plausible`, `Impact`, `Mitigation or watch signal`, and `Carries forward to`. Use stable `03ARCHI-ARCH-RISK-*` IDs and include only technical architecture risks, not product risks.
- Add `Architecture decisions` as accepted `03ARCHI-ADR-*` references with one-sentence consequences plus a concise ADR backlog for material unresolved choices. Create ADR files only for material durable choices that are established; explicitly state when no ADRs are accepted yet.
- Merge assumptions and open questions into one table with `ID`, `Type`, `Importance`, `Applies to`, `Current position`, `Why it matters`, and `Resolution path`. Use stable `03ARCHI-ASSUMPTION-*` and `03ARCHI-QUESTION-*` IDs plus `Blocking`, `High`, `Medium`, or `Low` importance. Do not present unverified technical guesses as facts.
- Add `Generation stop conditions`. Mark each condition `Clear` or `Blocked`. Stop generation and set the architecture artifact status to `blocked` when unresolved uncertainty would materially change component boundaries, data ownership, trust boundaries, deployment topology, integration contracts, irreversible technology choices, migration strategy, security or compliance posture, production authority, cost exposure, or public behavior.

### 04 Quality

Create a durable quality blueprint for measurable non-functional requirements and validation expectations. Quality owns security, privacy, data integrity, performance, scalability, reliability, availability, recovery, accessibility, compatibility, observability, and evidence requirements. It is not a duplicate product-risk list, architecture trust-boundary map, UX style guide, engineering test strategy, or change-local test plan.

- Use sections that make the artifact reviewable and enforceable: `Purpose`, `Quality context`, `Quality priorities`, `Non-functional requirements`, focused quality sections for security/privacy, reliability/recovery/operations, accessibility/compatibility, and observability/evidence when relevant, `Assumptions and open questions`, and `Generation stop conditions`.
- Explain whether the artifact reflects verified current behavior, intended target quality, or reversible defaults. For brownfield projects, cite code, tests, incidents, monitoring, deployment, security, accessibility, or performance evidence before claiming current quality.
- Start from quality drivers, not generic checklists. Derive quality priorities from product risks, domain rules, architecture drivers, data sensitivity, user workflows, operational constraints, regulatory or privacy exposure, and known failure modes.
- Do not duplicate product risks. Product owns market, adoption, and scope risks; quality turns durable risk concerns into measurable requirements and validation evidence.
- Do not duplicate architecture. Architecture owns components, data flows, deployment topology, trust boundaries, and ADRs; quality owns measurable thresholds, acceptance conditions, evidence requirements, and stop conditions for those concerns.
- Do not duplicate UX or engineering. UX owns design principles and interaction standards; engineering owns language/tooling/build/test conventions. Quality may state accessibility, compatibility, reliability, and evidence expectations that UX and engineering must satisfy.
- Use stable `04QUAL-NFR-*` IDs for measurable non-functional requirements that future requirements, tests, traceability, validation reports, or operational rules may reference.
- Write the main NFR table with columns `NFR ID`, `Attribute`, `Requirement`, `Measurement condition`, and `Rationale`. Requirements should be testable or reviewable; avoid vague goals such as "secure", "fast", "usable", or "reliable" without measurement conditions.
- Cover only applicable quality attributes. Consider security, privacy, tenant or authority isolation, data integrity, performance, scalability, reliability, availability, recoverability, accessibility, compatibility, observability, operability, auditability, localization, resilience, safety, compliance, and test evidence; omit categories that do not materially apply.
- For security and privacy, record concrete expectations for authentication, authorization, tenant isolation, input validation, output encoding, secret handling, personal or sensitive data, diagnostic safety, auditability, and data lifecycle. If lifecycle rules are unknown, record the uncertainty and whether it blocks production use.
- For performance and scalability, record initial target conditions using known or assumed data volumes, user counts, workflows, or load profiles. Do not invent enterprise-scale targets for a small first version; preserve assumptions and identify when real usage should recalibrate targets.
- For reliability, availability, and recovery, distinguish local/test expectations from production-readiness expectations. Record when availability targets, RPO, RTO, backup, restore, migration, rollback, health-check, and incident-diagnosis expectations must be decided.
- For accessibility and compatibility, record measurable baselines such as WCAG level, keyboard access, focus behavior, labels, error identification, status communication, supported browsers, device classes, API compatibility, and release coordination when relevant.
- For observability and evidence, record what logs, metrics, traces, health checks, audit records, command output, tests, scans, inspections, or manual reviews must exist to validate quality claims. Validation evidence must be reproducible or inspectable; implementation claims are not proof.
- Use one unified assumptions and open questions table with columns `ID`, `Type`, `Importance`, `Applies to`, `Current position`, `Why it matters`, and `Resolution path`. Use stable `04QUAL-ASSUMPTION-*` and `04QUAL-QUESTION-*` IDs plus `Blocking`, `High`, `Medium`, or `Low` importance. Proceed with reversible defaults only when uncertainty does not materially change security, privacy, data integrity, production operations, cost, public behavior, or required authority.
- Add `Generation stop conditions`. Mark each condition `Clear` or `Blocked`. Stop generation and set the quality artifact status to `blocked` when unresolved uncertainty would materially change security posture, privacy/compliance posture, data lifecycle, tenant isolation, safety, production availability/recovery commitments, cost exposure, public compatibility promises, or validation authority.

### 05 UX system

Record experience principles, navigation model, semantic tokens, interaction conventions, content behavior, accessibility, responsiveness, localization, and extension points. Avoid specifying screens that do not yet exist.

### 06 Engineering

Record languages and supported versions, package and build conventions, coding rules, test strategy, migration policy, source-control expectations, CI gates, rollout, rollback, and evidence requirements.

### 07 Repository map

Record important paths, module responsibilities, dependency direction, test locations, generated files, ownership, and commands confirmed from the repository. Mark intended paths separately from existing paths.

### Operational distillation

Create the distilled AI-production layer described by the knowledge-layer contract.

- `03-operational/00-agent-context.md` must be compact enough to load by default and must include the product purpose, non-goals, critical domain rules, chosen or current architecture direction, security/data boundaries, and links to canonical core artifacts.
- `03-operational/01-build-rules.md` must turn core knowledge into project-specific implementation guardrails, including module boundaries, dependency direction, tenant or authority rules, data/migration rules, UX constraints, and forbidden shortcuts.
- `03-operational/02-validation-rules.md` must turn core quality, domain, architecture, and engineering knowledge into project-specific validation expectations and evidence requirements.
- `03-operational/03-custom-skill-plan.md` must list candidate project-local skills only when a repeatable procedure is useful; do not create skill proposals that merely duplicate static core content.
- `03-operational/04-custom-check-workflow.md` must identify deterministic checks, model-reviewed checks, evidence paths, and check gaps that should become custom validation scripts or workflows.
- Each operational artifact must identify the core version it distills and must be refreshed or marked stale whenever core changes alter production-agent behavior.

## Quality gate

- `01-product.md` explains the main problem and the product's enduring purpose.
- Every materially different target user appears in the required persona table with needs and pain points.
- All known major product capabilities appear as descriptive, independently numbered epics with explicitly labeled sample user stories.
- Scope boundaries and product dependencies are descriptive, independently numbered entries.
- Product risks are descriptive table rows with stable `01PROD-RISK-*` IDs, concise names, Low/Medium/High probability and impact ratings, rationale, product impact, and watch or response guidance.
- `01-product.md` contains no reasoning-log sections for facts, decisions, or open questions.
- Every product assumption is unresolved, classified as blocking or non-blocking, and has a validation and disposition path.
- No blocking product assumption remains when the core artifact status is `ready`.
- In non-product artifacts, facts, decisions, assumptions, and open questions are distinguishable where uncertainty is recorded.
- `02-domain.md` explains its purpose, starts with shared vocabulary, records out-of-scope domain concepts, makes relationships explicit, captures states and events when meaningful, and links durable rules to concepts or relationships with stable IDs.
- `02-domain.md` does not duplicate `01-product.md`; domain exclusions are limited to prohibited domain concepts, actors, states, events, decisions, or authorities.
- `02-domain.md` records ownership, authority, and domain boundaries for important domain objects where future work could otherwise assign authority implicitly.
- `02-domain.md` has a unified assumptions and open questions table with importance and resolution paths.
- `02-domain.md` defines generation stop conditions and is marked `blocked` when any stop condition is blocked.
- `03-architecture.md` explains its purpose, separates verified current state from intended target state, and cites repository evidence for brownfield architecture claims.
- `03-architecture.md` records architecture-driving use cases, quality-attribute priorities, constraints, optimization goals, non-goals, style and stack options, and the tradeoffs behind the recommended direction.
- `03-architecture.md` includes compact architecture views where useful and identifies runtime components and modules with stable IDs, responsibilities, owned technical concerns, inbound contracts, outbound dependencies, and status or evidence.
- `03-architecture.md` records checkable boundaries, dependency rules, concrete major violation examples, data architecture, integration architecture, trust boundaries, deployment and operations topology, technical risks/tradeoffs, and accepted or candidate ADR references without duplicating product, domain, quality, engineering, or repository-map artifacts.
- `03-architecture.md` has a unified assumptions and open questions table with importance and resolution paths.
- `03-architecture.md` defines generation stop conditions and is marked `blocked` when any stop condition is blocked.
- `04-quality.md` explains its purpose and separates verified current quality from intended targets, assumptions, and open questions.
- `04-quality.md` records quality context and priorities derived from product risks, domain rules, architecture drivers, data sensitivity, user workflows, and operational constraints without duplicating product, domain, architecture, UX, engineering, or change-local test plans.
- `04-quality.md` defines measurable `04QUAL-NFR-*` requirements with attributes, requirements, measurement conditions, and rationales.
- `04-quality.md` covers applicable security, privacy, tenant isolation, authorization, data integrity, reliability, availability, recovery, performance, scalability, accessibility, compatibility, observability, operability, auditability, and evidence expectations while omitting irrelevant filler categories.
- `04-quality.md` records validation evidence expectations for quality claims, including automated tests, scans, inspections, telemetry, restore checks, accessibility review, or manual evidence where appropriate.
- `04-quality.md` has a unified assumptions and open questions table with importance and resolution paths.
- `04-quality.md` defines generation stop conditions and is marked `blocked` when unresolved uncertainty would materially change security posture, privacy or compliance posture, data lifecycle, tenant isolation, production availability/recovery commitments, cost exposure, public compatibility promises, or validation authority.
- `03-operational/` exists when enough core knowledge exists to guide production agents, or its missing pieces are explicitly marked blocked with the core knowledge needed to finish them.
- Distilled operational artifacts do not contradict the core and are compact enough to be loaded by default for implementation and validation work.
- Contradictions between requirements and repository reality are surfaced.
- Core files contain durable guidance rather than feature-local implementation plans.
- Unknowns are retained explicitly instead of filled with plausible detail.
- Traceability includes important outcomes, product epics, rules, NFRs, and ADRs without creating decorative links.
