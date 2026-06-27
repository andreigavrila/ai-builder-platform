---
description: Creates or reconstructs the durable v2 core blueprint for a greenfield or existing software project. Use before planning changes when product, domain, architecture, quality, UX, engineering, or repository knowledge is missing or unstructured.
---

# Initialize Core Blueprint V2

Create the durable system description used by future change packages.

## Contract and outputs

Read `.agents/workflows/v2/references/artifact-contract.md` and `.agents/workflows/v2/references/lifecycle-contract.md`.

Write under `{blueprintDir}`:

- `00-manifest.json` and `99-traceability.json`.
- All files under `01-core/` defined by the artifact contract.
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
7. Initialize core version `1`; use a higher version only when reconstructing documented history.
8. Run the blueprint validator and resolve structural errors.

## Core artifact requirements

### 01 Product

Create an executive product boundary using the product artifact contract.

- Write a descriptive purpose with an explicit `Problem being solved` statement followed by the `Product purpose`. Explain who experiences the problem, why the current situation is insufficient, how the product addresses it, and the intended value.
- Write target users as a table with `Persona`, `Description`, `Key needs`, and `Pain points`. Include all materially different user groups, using role-based archetypes without inventing market evidence or demographic detail.
- Write every known major product capability as a numbered epic with a stable `EPIC-*` ID and title. Each epic must include a description of its users, goal, context, included capability, and successful result, plus explicitly labeled sample user stories. Do not restrict this core view to the initial release change.
- Add each product epic to `99-traceability.json` as an `epic` node and connect relevant outcomes to it.
- Write scope boundaries as a numbered list with stable `BOUNDARY-*` IDs. Make exclusions detailed enough to prevent adjacent products, workflows, users, channels, integrations, content, and operating modes from being inferred as in scope.
- Write product dependencies as a numbered list with stable `DEPENDENCY-*` IDs. Include only external products, services, interfaces, operating platforms, industry ecosystems, policy authorities, or outside commitments that materially constrain product scope, availability, compliance, customer value, or go-to-market assumptions.
- Exclude generic prerequisites that are true for most software, such as durable storage, a web browser, authentication, network access, hosting, packages, build tools, test libraries, or common runtime platforms, unless the requirement makes a specific dependency product-defining. Put those in architecture, engineering, or the relevant change package instead.
- Apply this viability test before adding each dependency: if the named thing could be swapped during technical design without changing product scope, user promise, regulatory posture, data authority, or external operating model, it is not a product dependency.
- Prefer fewer, sharper dependencies over generic platform inventory. If no materially product-shaping dependencies are known yet, write one explicit numbered dependency stating that no external product dependencies are established yet.
- Write product-level risks as a Markdown table with columns `Risk ID`, `Risk`, `Probability`, `Impact`, `Rationale`, `Product impact`, and `Watch/response`.
- Give every risk a stable `RISK-*` ID and concise descriptive name. Use simple `Low`, `Medium`, or `High` probability and impact values, ordered by higher impact first and then higher probability.
- For each risk, state the risk condition, why it is plausible from the requirement or domain, the product impact if it materializes, and at least one watch signal or response path.
- Before finalizing risks, explicitly scan these categories and include only durable product-level risks that genuinely apply: user adoption and workflow fit, data authority and privacy, security and abuse, legal or compliance exposure, scope creep, dependency or ecosystem shifts, operational feasibility, accessibility and usability, migration or data quality, and delivery complexity. Do not add generic filler risks merely to cover every category.
- Do not create `Facts`, `Decisions`, or `Open questions` sections. Merge unresolved questions into `Unresolved assumptions`.
- Keep only unresolved scope-significant assumptions. Give each a stable `ASSUMPTION-*` ID, blocking classification, validation method, and target epic or boundary. Resolve each assumption into its target entry, update any related dependency, and then remove it.

### 02 Domain

Create a human-readable domain artifact using the domain artifact contract. Use software-neutral sections that work for any project type: `Purpose`, `Core concepts and entities`, `Out-of-scope domain concepts`, `Relationships`, `States and transitions`, `Domain events`, `Core rules and constraints`, `Ownership, authority, and boundaries`, `Assumptions and open questions`, and `Generation stop conditions`.

- Do not create a more detailed copy of the product artifact. Product owns purpose, target users, outcomes, epics, product scope boundaries, dependencies, and risks. Domain owns shared nouns, domain-specific meanings, relationships, states, rules, authority, events, and modeling guardrails.
- Start with `Core concepts and entities` so readers learn the vocabulary before exclusions, relationships, states, events, rules, or authority. Use a table with `Concept`, `Type`, `Meaning`, and `Why it matters`.
- Use `Out-of-scope domain concepts` only for excluded concepts, actors, states, events, decisions, or authorities that future work might otherwise add to the domain model. Do not copy product scope boundaries into the domain artifact unless a boundary prevents a specific invalid domain model element.
- Add `Relationships` as a table with `Relationship ID`, `From`, `Relationship`, `To`, `Cardinality`, and `Meaning`. Make ownership, membership, association, attachment, status, and authority relationships explicit when they affect behavior or data integrity.
- Add `States and transitions` only for domain objects whose status progression matters. Explain valid states, allowed transitions, terminal states, and state meanings.
- Add `Domain events` as a table with `Event`, `Source`, `When it occurs`, `Meaning`, and `External contract`. Keep implementation-only event candidates out unless they are useful test-observable domain milestones.
- Record durable rules and invariants as a table with `Rule ID`, `Applies to`, `Rule`, and `Rationale`. Link `Applies to` to concepts, relationship entities, relationships, states, events, policies, or boundaries named earlier.
- Record ownership, authority, and domain boundaries so future agents do not silently decide who may create, modify, approve, resolve, delete, interpret, or see important domain objects.
- Merge assumptions and open questions into one table with `ID`, `Type`, `Importance`, `Applies to`, `Current position`, `Why it matters`, and `Resolution path`. Use `Blocking`, `High`, `Medium`, or `Low` importance.
- Add `Generation stop conditions`. Mark each condition `Clear` or `Blocked`. Stop generation and set the domain artifact status to `blocked` when unresolved uncertainty would materially change domain structure, data ownership, authority, lifecycle meaning, privacy or compliance posture, irreversible scope, or public behavior.
- Keep persistence details in architecture unless they are domain-significant.

### 03 Architecture

Record system context, components, boundaries, dependency rules, data ownership, integration contracts, deployment topology, trust boundaries, and accepted ADRs. For brownfield projects, cite repository evidence.

### 04 Quality

Record applicable and measurable security, privacy, performance, reliability, accessibility, compatibility, observability, and recovery requirements. Include measurement conditions and rationale.

### 05 UX system

Record experience principles, navigation model, semantic tokens, interaction conventions, content behavior, accessibility, responsiveness, localization, and extension points. Avoid specifying screens that do not yet exist.

### 06 Engineering

Record languages and supported versions, package and build conventions, coding rules, test strategy, migration policy, source-control expectations, CI gates, rollout, rollback, and evidence requirements.

### 07 Repository map

Record important paths, module responsibilities, dependency direction, test locations, generated files, ownership, and commands confirmed from the repository. Mark intended paths separately from existing paths.

## Quality gate

- `01-product.md` explains the main problem and the product's enduring purpose.
- Every materially different target user appears in the required persona table with needs and pain points.
- All known major product capabilities appear as descriptive, independently numbered epics with explicitly labeled sample user stories.
- Scope boundaries and product dependencies are descriptive, independently numbered entries.
- Product risks are descriptive table rows with stable `RISK-*` IDs, concise names, Low/Medium/High probability and impact ratings, rationale, product impact, and watch or response guidance.
- `01-product.md` contains no reasoning-log sections for facts, decisions, or open questions.
- Every product assumption is unresolved, classified as blocking or non-blocking, and has a validation and disposition path.
- No blocking product assumption remains when the core artifact status is `ready`.
- In non-product artifacts, facts, decisions, assumptions, and open questions are distinguishable where uncertainty is recorded.
- `02-domain.md` explains its purpose, starts with shared vocabulary, records out-of-scope domain concepts, makes relationships explicit, captures states and events when meaningful, and links durable rules to concepts or relationships with stable IDs.
- `02-domain.md` does not duplicate `01-product.md`; domain exclusions are limited to prohibited domain concepts, actors, states, events, decisions, or authorities.
- `02-domain.md` records ownership, authority, and domain boundaries for important domain objects where future work could otherwise assign authority implicitly.
- `02-domain.md` has a unified assumptions and open questions table with importance and resolution paths.
- `02-domain.md` defines generation stop conditions and is marked `blocked` when any stop condition is blocked.
- Contradictions between requirements and repository reality are surfaced.
- Core files contain durable guidance rather than feature-local implementation plans.
- Unknowns are retained explicitly instead of filled with plausible detail.
- Traceability includes important outcomes, product epics, rules, NFRs, and ADRs without creating decorative links.
