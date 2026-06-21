# Comparison Matrix

## Legend

- `●` — first-class, documented capability
- `◐` — partial, optional, or less rigorous support
- `○` — absent or not central to the documented method

The ratings are interpretive comparisons against the local V2 contracts, not empirical quality measurements.

## Capability matrix

| Method | Durable project core | Per-change package | Adaptive rigor | Executes implementation | Evidence gates | Independent validation | Explicit traceability | Core promotion/version impact |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Local V2 | ● | ● | ● | ● | ● | ● | ● | ● |
| AWS AI-DLC | ◐ | ● | ● | ● | ● | ◐ | ◐ | ○ |
| BMAD | ◐ | ● | ● | ● | ● | ◐ | ◐ | ○ |
| GitHub Spec Kit | ◐ | ● | ◐ | ● | ● | ○ | ◐ | ○ |
| GSD Core | ◐ | ● | ◐ | ● | ● | ◐ | ◐ | ◐ |
| Google Conductor | ● | ● | ◐ | ● | ◐ | ○ | ◐ | ◐ |
| RuFlo SPARC | ◐ | ● | ○ | ● | ● | ◐ | ● | ○ |
| OpenSpec | ◐ | ● | ◐ | ● | ◐ | ○ | ◐ | ◐ |
| Superpowers | ○ | ● | ◐ | ● | ● | ◐ | ◐ | ○ |
| Kiro Specs | ◐ | ● | ◐ | ● | ◐ | ○ | ◐ | ○ |
| Agent OS | ● | ● | ◐ | ○ | ◐ | ○ | ○ | ◐ |
| APM | ◐ | ● | ◐ | ● | ◐ | ◐ | ◐ | ○ |
| PRP framework | ◐ | ● | ○ | ● | ◐ | ○ | ◐ | ○ |
| Taskmaster | ○ | ◐ | ◐ | ● | ◐ | ○ | ◐ | ○ |
| MetaGPT | ○ | ◐ | ○ | ● | ◐ | ○ | ◐ | ○ |
| ChatDev | ○ | ◐ | ○ | ● | ◐ | ○ | ○ | ○ |
| Roo Boomerang | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ |

## V2 differentiators to preserve

### 1. Durable core versus local change

V2 gives every kind of durable knowledge a named owner under `core/`, while keeping transient implementation information inside one change package. This is more precise than a general constitution, steering file, memory bank, or standards directory.

### 2. Version pinning and staleness

Every change records the core version used for interpretation. A material core update triggers an impact assessment of non-terminal changes and marks only affected work stale. None of the surveyed methods describes this full configuration-management behavior.

### 3. Independent validation

The validator starts from the original request and actual repository state, treats execution logs as unproven claims, cannot modify implementation, and produces evidence-linked findings. Most alternatives provide review or verification, but not this separation of duties.

### 4. End-to-end traceability

V2 defines stable nodes and meaningful edges across:

```text
OUTCOME -> EPIC -> REQ -> RULE/NFR -> ADR/DESIGN
    -> TASK -> CODE -> TEST -> EVIDENCE
```

Other frameworks may link tasks to requirements or generate traceability reports, but few make the graph a persistent machine-readable project artifact.

### 5. Controlled knowledge promotion

Only accepted, durable knowledge is promoted into the core. Feature-local detail remains with the change. The update can create or supersede ADRs, increment the core version, and invalidate affected plans.

### 6. Question and authority policy

V2 distinguishes blocking, reversible, and discoverable uncertainty. It also separates implementation authorization from deployment, publication, destructive migration, or production mutation. This avoids both silent guessing and approval fatigue.

## Capabilities worth borrowing

| Source | Candidate lesson for V2 |
|---|---|
| AI-DLC | Extensible rule packs with verifiable blocking criteria |
| BMAD | Strong discovery workflows and scale-sensitive specialist routing |
| Spec Kit | Constitution checks, specification checklists, and cross-artifact analysis |
| GSD Core | Fresh-context execution and explicit protection against context degradation |
| Conductor | Simple project-context onboarding and change-track usability |
| OpenSpec | Lightweight proposal/archive ergonomics and configurable workflow profiles |
| SPARC | Visible gate history and generated traceability reports |
| Superpowers | TDD enforcement and separate specification/code-quality reviews |
| Kiro | Compact feature and bugfix specification formats |
| Agent OS | Discovery and selective injection of existing codebase standards |
| APM | Domain-focused workers with structured context handoffs |
| Taskmaster | Dependency-aware task execution and workstream management |
