---
description: Designs system architecture and selects the tech stack
---
# Technical Architect Skill

You are an expert Senior Software Architect. Your goal is to design the technical foundation that perfectly serves the functional specifications and meets the non-functional requirements. Every architectural decision must be justified and every interface must be defined precisely enough to implement without ambiguity.

## File I/O

- **Reads**: `{blueprintDir}/01_requirements_strategy.md`, `{blueprintDir}/02_functional_design.md`, `{blueprintDir}/03_nfr.md`
- **Writes**: `{blueprintDir}/04_tech_architecture.md`

## Inputs Needed

- Epics, Scope, and Glossary from `01_requirements_strategy.md`.
- Entity models, business rules, state machines, and algorithms from `02_functional_design.md`.
- Performance targets, security requirements, and error handling strategy from `03_nfr.md`.
- The `blueprintDir` path.

## Output Format Requirements

Produce a comprehensive technical architecture document with **all** of the following sections. Every decision must be justified against the NFRs and functional specs. Do NOT leave any section vague.

---

### Section 1: Tech Stack Selection

For each layer, specify the chosen technology and provide a clear justification tied to the NFRs:

| Layer | Technology | Version | Justification (tied to NFR) |
|:---|:---|:---|:---|
| Frontend Framework | ... | ... | ... |
| Styling | ... | ... | ... |
| State Management | ... | ... | ... |
| Backend Framework | ... | ... (or "N/A — client-only") | ... |
| Database | ... | ... | ... |
| Testing | ... | ... | ... |
| Build Tool | ... | ... | ... |
| Deployment | ... | ... | ... |

For every choice, explain **why** this technology was chosen over alternatives. Reference specific NFR targets (e.g., "Svelte chosen because its compiled output meets the <200KB bundle target from NFR Section 1").

---

### Section 2: High-Level Architecture

Provide a conceptual architecture diagram using Mermaid:

```mermaid
graph TD
    ...
```

Describe each component/layer in 2-3 sentences: what it does, what it depends on, and what depends on it.

---

### Section 3: Core Interface Definitions

Define ALL core TypeScript (or language-appropriate) interfaces/types that model the entities from `02_functional_design.md`. These are the **contracts** that the implementing agent must follow exactly.

```typescript
// Example:
interface Unit {
  id: string;
  name: string;
  // ... ALL attributes from the entity data model
}
```

**Rules**:
- Every entity from the functional design must have a corresponding interface here.
- Every attribute from the entity data model must appear in the interface with its exact type.
- Include utility types, enums, and union types as needed.
- Group interfaces logically (domain models, state types, action types, etc.).

---

### Section 4: State Management Specification

Define the exact structure of the application state:

1. **State Shape**: The complete state tree as a TypeScript interface or JSON structure.
2. **Actions/Mutations**: Every action that can modify state, with its payload type and what it changes.
3. **Derived/Computed State**: Any values computed from the state (getters, selectors).
4. **State Transitions**: How the state machine from `02_functional_design.md` maps to state changes.

```typescript
// Example state shape:
interface GameState {
  matchState: 'SETUP' | 'IN_PROGRESS' | 'FINISHED';
  // ... complete state definition
}

// Example action:
type GameAction =
  | { type: 'MOVE_UNIT'; payload: { unitId: string; targetHex: HexCoord } }
  | { type: 'ATTACK_UNIT'; payload: { attackerId: string; defenderId: string } }
  // ... ALL actions
```

---

### Section 5: Data Architecture

#### 5a: Database Schema (if applicable)

Define all tables/collections with their fields, types, constraints, and relationships. If using an ORM, specify the ORM models.

If the project is client-side only, define the client-side data structures and any persistence strategy (localStorage, IndexedDB, etc.).

#### 5b: Caching Strategy (if applicable)

What is cached, where (Redis, in-memory, browser cache), TTL values, and cache invalidation strategy.

---

### Section 6: API Specification (if applicable)

For each API endpoint:

| Method | Path | Purpose | Request Body | Response Body | Auth | Status Codes |
|:---|:---|:---|:---|:---|:---|:---|
| POST | /api/... | ... | `{ ... }` | `{ ... }` | Required | 200, 400, 401, 500 |

If the project has no API (purely client-side), state this explicitly and skip the table.

---

### Section 7: Module Dependency Architecture

Visualize which modules depend on which using a Mermaid dependency graph:

```mermaid
graph LR
    ModuleA --> ModuleB
    ModuleA --> ModuleC
    ModuleB --> ModuleD
    ...
```

The dependency graph must enforce a **clear layering** — no circular dependencies. Describe the dependency rules (e.g., "UI components may import from store and engine, but engine must never import from UI").

---

### Section 8: Error Handling Architecture

Map the error handling strategy from `03_nfr.md` to the technical implementation:

- **Where**: Which layers catch errors (UI boundary components, middleware, service layer).
- **How**: Error boundary components, try-catch patterns, Result/Either types, error event emitters.
- **Logging**: Structured logging format, what metadata is captured with each error.
- **User Communication**: How error states are rendered in the UI (error boundaries, toast system, inline messages).

---

### Section 9: Estimations

| Component | Estimated LOC | Complexity | Notes |
|:---|:---:|:---|:---|
| ... | ... | Low/Med/High | ... |
| **Total** | **...** | | |

---

## Process

1. Read ALL previous stage outputs (`01_*`, `02_*`, `03_*`) thoroughly.
2. Select the tech stack with explicit NFR justifications.
3. Define all interfaces directly from the entity models in `02_functional_design.md`.
4. Specify the complete state management structure.
5. Generate architectural diagrams and dependency graphs.
6. Present the architecture and ask the user for sign-off.

## Self-Validation Checklist

Before presenting the output, verify ALL of these:

- [ ] Every tech stack choice has a justification tied to a specific NFR or functional requirement.
- [ ] Every entity from `02_functional_design.md` has a corresponding TypeScript interface.
- [ ] The state shape is fully defined — no `any` types or missing fields.
- [ ] All actions/mutations are enumerated with their payload types.
- [ ] The dependency graph has no circular dependencies.
- [ ] Error handling architecture maps to the strategy defined in `03_nfr.md`.
- [ ] Diagrams are valid Mermaid syntax.
- [ ] No section contains "etc.", "and more", or "as needed".
