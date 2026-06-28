# V2 Blueprint Authoring Philosophy

Use this reference before creating or revising v2 blueprint artifacts. It captures the current authoring philosophy for durable project knowledge.

## Principle

V2 should produce durable project knowledge that is useful to humans first, then enforceable by agents and validators. Artifacts should not be verbose mirrors of each other. Each file needs a clear job, a reader-friendly order, stable IDs, and enough structure that future agents can continue without inventing hidden assumptions.

V2 uses separate knowledge layers. `01-core/` is the human-reviewable source of truth. `03-operational/` is the distilled AI-production context derived from the core and loaded by default for implementation and validation. `02-changes/{CHANGE-ID}/` contains one requirement implementation blueprint. Core remains canonical; distilled operational artifacts must be refreshed or marked stale when core changes alter production-agent behavior.

## Product blueprint

`01-core/01-product.md` is the executive product boundary.

It answers:

- What problem is being solved.
- Who the product serves.
- What outcomes matter.
- What major product capabilities exist.
- What is explicitly outside the product promise.
- Which dependencies are truly product-shaping.
- Which durable product risks need attention.

### Product dependency philosophy

Product dependencies should not list generic software prerequisites such as storage, auth, browsers, hosting, or runtime platforms unless they materially shape the product promise.

Before adding a dependency, ask whether swapping the named thing during technical design would change product scope, user promise, regulatory posture, data authority, or external operating model. If not, it belongs in architecture, engineering, or a change package, not in product dependencies.

If no meaningful external dependency is known, say that explicitly.

### Product risk philosophy

Product risks should be a table with probability, impact, rationale, product impact, and watch or response guidance.

Order risks by impact first, then probability. To make risks substantive, scan adoption and workflow fit, data and privacy, security and abuse, legal or compliance exposure, scope creep, dependency shifts, operational feasibility, accessibility and usability, data quality, and delivery complexity. Include only risks that genuinely apply; do not add filler rows just to cover categories.

## Domain blueprint

`01-core/02-domain.md` is not a more detailed product file. It is the domain deep dive: vocabulary, model boundaries, relationships, states, rules, authority, uncertainty, and stop conditions.

Use this order:

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

### Domain/product separation

Product owns the market-facing promise: purpose, target users, outcomes, epics, product scope boundaries, dependencies, and risks.

Domain owns the model: shared nouns, domain meanings, relationships, states, events, rules, authority, and modeling guardrails.

Domain exclusions should not copy product exclusions. They should block invalid domain concepts, actors, states, events, decisions, or authorities that future work might otherwise introduce.

### Domain deep-dive expectations

Start with vocabulary and entities so readers understand the domain before reading exclusions, relationships, states, events, rules, or authority.

Make relationships explicit. Include IDs, cardinality, and meaning when relationships affect behavior, data integrity, ownership, access, or lifecycle.

Write rules as a table and link each rule to a concept, relationship entity, relationship, state, event, policy, or boundary named earlier in the artifact.

Do not let authority disappear. Business-system mistakes often come from unclear authority: who can create, update, close, delete, interpret, or see records.

Use one unified assumptions and open questions table with importance and resolution path. If work proceeds with a reversible default, record it as the current position instead of hiding the uncertainty in prose.

Generation must stop when unanswered points would materially change domain structure, data ownership, authority, lifecycle meaning, privacy or compliance posture, irreversible scope, or public behavior. If any stop condition is blocked, mark the domain artifact `blocked`.

## Architecture blueprint

`01-core/03-architecture.md` is the durable technical map for how the product and domain are realized. It is not a feature implementation plan, a repository inventory, or an exhaustive low-level design.

It answers:

- What runtime system is being described.
- Which architecture drivers, constraints, and quality-attribute priorities shape the design.
- Which use cases justify the major architecture choices.
- Which architecture style and stack options are recommended, accepted, or rejected.
- Which components exist or are intended to exist.
- How major layers, modules, and deployable containers work together.
- Which responsibilities belong to each component.
- Which boundaries and dependency directions future work must respect.
- Where durable data is owned, stored, moved, and exposed.
- Which integration contracts shape the system.
- Which trust boundaries and security-relevant flows matter.
- How the system is deployed or expected to be deployed.
- Which architecture risks and tradeoffs need attention.
- Which architectural decisions are accepted in ADRs.
- Which technical uncertainties must stop downstream generation.

Use this order:

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

### Architecture/product/domain separation

Product owns the promise. Domain owns the model. Architecture owns the technical shape that must preserve both: components, dependencies, data flow, integration contracts, trust boundaries, deployment topology, and accepted technical decisions.

Do not move product scope into architecture. If an architectural choice changes the user promise, product dependency, compliance posture, or external operating model, update the product artifact or create a change package instead of hiding the decision in architecture.

Do not move domain rules into architecture. Architecture should show where a domain rule is enforced or protected, but the rule itself remains in `02-domain.md`.

Keep repository-file inventory in `07-repository-map.md`. Architecture may cite important paths as evidence, but it should not become a directory listing.

### Architecture deep-dive expectations

Separate verified current state from intended target state. For brownfield projects, cite repository evidence for claims about existing components, dependencies, configuration, schemas, APIs, deployment files, and tests. For greenfield projects, label architectural choices as intended, assumed, or undecided.

Start from drivers, not technology inventory. Identify the use cases, quality attributes, team skills, budget or operational constraints, regulatory or privacy constraints, external-system constraints, and delivery constraints that explain the architecture. Architecture may prioritize quality attributes, but measurable NFR targets belong in `04-quality.md`.

State what the architecture optimizes for and what it deliberately does not optimize for yet. This prevents future agents from over-designing for scale, integration volume, analytics depth, compliance depth, or platform abstraction before the product needs it.

Record architecture style and stack options as a compact recommendation table when the stack is not already accepted. The artifact should make the recommended default clear, preserve alternatives and tradeoffs, and route material choices to ADRs.

Use compact C4-style views where they clarify the system: a system context diagram, a container/deployable diagram, and optionally a module/layer diagram. Prefer short Mermaid diagrams plus tables over long prose.

Make components explicit with stable IDs, responsibilities, owned data, inbound contracts, outbound dependencies, and evidence or status. Readers should be able to tell whether a component is a UI, API, worker, library, data store, external system, or infrastructure concern.

Describe major layers, modules, ownership boundaries, and extension points. For modular monoliths, identify module boundaries and split conditions. For microservices or distributed systems, justify service boundaries and operational costs.

Dependency rules should be directional and enforceable. Name allowed and forbidden dependencies, especially across UI, domain, application, infrastructure, persistence, integration, and test boundaries. Include major violation examples under the relevant boundary when architecture boundaries are easy to misuse; concrete bad examples help production agents and validators recognize unacceptable designs faster than abstract rules alone.

Data ownership belongs here at the technical level: stores, schemas, source-of-truth boundaries, tenant keys, lifecycle handling, replication, caches, imports, exports, and audit-relevant movement. Domain ownership remains in `02-domain.md`.

Integration contracts should distinguish internal module contracts, public APIs, external service contracts, event contracts, file formats, and browser or platform contracts. Record versioning, compatibility expectations, and failure behavior when known.

Trust boundaries should include actors, processes, networks, data stores, credentials, secrets, permissions, personal or sensitive data, cross-tenant boundaries, and externally supplied input. Architecture must not hand-wave security-sensitive flows into generic "auth" language.

Record technical architecture risks and tradeoffs separately from product risks. Include the risk condition, why the architecture creates or accepts it, impact, mitigation, and decision or quality artifact that must carry it forward.

Architecture decisions should reference accepted ADRs rather than restating them in full. Create ADRs only for material, durable choices; do not create decorative ADRs for obvious defaults.

Use one unified assumptions and open questions table. If work proceeds with a reversible technical default, record the current position and the gate where it must be resolved.

Generation must stop when unanswered points would materially change component boundaries, data ownership, trust boundaries, deployment topology, integration contracts, irreversible technology choices, migration strategy, security or compliance posture, production authority, cost exposure, or public behavior. If any stop condition is blocked, mark the architecture artifact `blocked`.

## Validator and workflow expectations

Workflow instructions and validators should encode these conventions rather than relying on taste. When a contract changes, update:

- The relevant reference contract.
- The relevant workflow skill.
- The structural validator when the rule can be checked deterministically.
- Existing example or active blueprint files that would otherwise teach the old pattern.

Run the validator self-test after workflow-suite changes:

```powershell
node .agents/workflows/v2/scripts/validate-blueprints.cjs --self-test
```

## ATS-specific decisions captured during design

The ATS seed blueprint established these modeling choices:

- Customer organization is the core ownership and data boundary.
- Candidate identity is customer-organization-local, not global.
- Candidate progress is modeled through `Candidate relationship`, not only a single candidate status.
- Company contacts, internal contacts, candidates, and customer-users are distinct concepts.
- Activity records can document notes, interactions, and next steps but do not prove an external communication was sent.
- Contacts are records, not authenticated users by default.
- Basic role separation exists, but complex enterprise permissions are outside first-version scope.
- AI scoring, ranking, matching, sent-email proof events, public candidate portal actors, compliance-case objects, and employee lifecycle records are out-of-scope domain concepts.

## Current ATS blueprint caveat

The ATS blueprint is intentionally partial. It currently has manifest, product, domain, and architecture files, but not the full v2 core, distilled operational layer, traceability, or change package. Full blueprint validation is expected to fail until those are created.
