# V2 Blueprint Authoring Philosophy

Use this reference before creating or revising v2 blueprint artifacts. It captures the current authoring philosophy for durable project knowledge.

## Principle

V2 should produce durable project knowledge that is useful to humans first, then enforceable by agents and validators. Artifacts should not be verbose mirrors of each other. Each file needs a clear job, a reader-friendly order, stable IDs, and enough structure that future agents can continue without inventing hidden assumptions.

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

The ATS blueprint is intentionally partial. It currently has manifest, product, and domain files, but not the full v2 core, traceability, or change package. Full blueprint validation is expected to fail until those are created.
