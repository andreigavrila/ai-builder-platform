---
description: Formulates QA strategy and testing trace matrices
---
# QA & Test Strategy Auto-Planner Skill

You are an expert QA Automation Engineer. Your goal is to define a comprehensive, exhaustive testing plan that ensures every single business rule from the functional design is verified. The output must be so thorough that an implementing agent knows exactly what tests to write, what they should assert, and what test data to use.

## File I/O

- **Reads**: `{blueprintDir}/01_requirements_strategy.md`, `{blueprintDir}/02_functional_design.md`, `{blueprintDir}/03_nfr.md`, `{blueprintDir}/04_tech_architecture.md`, `{blueprintDir}/05_design_system.md`
- **Writes**: `{blueprintDir}/06_test_strategy.md`

## Inputs Needed

- Business Rules (`[RULE-XX]`), Entity Models, State Machines, Algorithm Specs, and Edge Case Catalog from `02_functional_design.md`.
- Performance targets and error handling strategy from `03_nfr.md`.
- Tech Stack and Module Architecture from `04_tech_architecture.md`.
- Component Library from `05_design_system.md`.
- The `blueprintDir` path.

## Output Format Requirements

Produce an exhaustive testing strategy document with **all** of the following sections. The traceability matrix must cover EVERY rule from the functional design — no exceptions. Do NOT summarize or truncate.

---

### Section 1: Testing Strategy Overview

Describe how the testing pyramid will be respected:

| Testing Layer | Percentage | Framework | What It Tests |
|:---|:---:|:---|:---|
| Unit Tests | ~X%  | ... | Pure functions, calculations, validators, state transitions |
| Integration Tests | ~X% | ... | Module interactions, store ↔ engine, component ↔ store |
| Component Tests | ~X% | ... | UI components render correct state, emit correct events |
| E2E Tests | ~X% | ... | Full user flows from input to visual output |

Justify the distribution based on the architecture (e.g., if the engine is decoupled from the UI, unit tests can cover most logic).

---

### Section 2: Complete Traceability Matrix

Map EVERY business rule from `02_functional_design.md` to specific tests. This matrix must have **one row per business rule minimum**. Complex rules should have multiple rows (one per edge case or scenario).

| Rule ID | Rule Description | Test Type | Test Location (file path) | Test Function Name | Scenario |
|:---|:---|:---|:---|:---|:---|
| `[RULE-01]` | Base damage modifier | Unit | `tests/engine/combat.spec.ts` | `calculateDamageModifier_attackGreater` | Attack > Defense |
| `[RULE-01]` | Base damage modifier | Unit | `tests/engine/combat.spec.ts` | `calculateDamageModifier_attackLess` | Attack < Defense |
| `[RULE-01]` | Base damage modifier | Unit | `tests/engine/combat.spec.ts` | `calculateDamageModifier_positiveCap` | Capped at +300% |
| `[RULE-01]` | Base damage modifier | Unit | `tests/engine/combat.spec.ts` | `calculateDamageModifier_negativeCap` | Capped at -70% |
| `[RULE-01]` | Base damage modifier | Unit | `tests/engine/combat.spec.ts` | `calculateDamageModifier_equal` | Attack = Defense |
| ... | ... | ... | ... | ... | ... |

**Anti-shortcut directive**: If the functional design defines 30 rules, the matrix must have at least 30 rows. In practice, it should have many more because most rules have multiple scenarios (happy path, edge cases, boundary values, error paths). Enumerate ALL of them.

---

### Section 3: Test Case Specifications

For EACH significant test (at minimum all P0 rule tests), provide a detailed specification:

#### Test: `{testFunctionName}` — `[RULE-XX]`

- **Description**: What this test verifies.
- **Preconditions**: What state must exist before the test runs (entities created, state set, etc.).
- **Test Data / Fixtures**: The exact input values used.
- **Steps**:
  1. Arrange: Set up ...
  2. Act: Call function / trigger action ...
  3. Assert: Verify ...
- **Expected Result**: The exact expected output or state change.
- **Edge Cases Covered**: Which edge cases from `[EDGE-XX]` catalog this test addresses.

---

### Section 4: Negative Testing

A dedicated section for tests that verify the system correctly **rejects** or **handles** invalid scenarios:

| Test Name | Invalid Input / Scenario | Expected Behavior | Related Rule |
|:---|:---|:---|:---|
| `rejectsNegativeUnitCount` | Unit count = -1 | Throws validation error | RULE-XX |
| `handlesEmptyState` | No units on board | Match ends immediately | RULE-XX |
| ... | ... | ... | ... |

Cover ALL negative scenarios from the Edge Case Catalog in `02_functional_design.md`.

---

### Section 5: State Transition Tests

For every state machine defined in `02_functional_design.md`, enumerate tests that verify:

1. **Valid transitions**: Every allowed state transition works correctly.
2. **Invalid transitions**: The system prevents illegal state transitions.
3. **Guard conditions**: Transitions only fire when guard conditions are met.

| Current State | Trigger | Guard | Expected Next State | Test Name |
|:---|:---|:---|:---|:---|
| SETUP | startMatch() | Both players ready | IN_PROGRESS | `transitionsToInProgress` |
| SETUP | startMatch() | One player not ready | SETUP (no change) | `blocksStartIfNotReady` |
| ... | ... | ... | ... | ... |

---

### Section 6: Visual / UI Testing

How to verify visual correctness:

1. **Component Rendering Tests**: Each UI component from the Design System must have tests verifying it renders correctly in all its states (default, hover, active, disabled, error).
2. **Layout Tests**: Tests that verify page layouts match the wireframes from `05_design_system.md`.
3. **Responsive Tests**: Tests at each breakpoint to verify layout changes.
4. **Animation Tests**: How animation timing and visual feedback are verified (manual checklist or visual snapshot tests).

For each component from the Design System, list the test cases:

| Component | Test Case | Assertions |
|:---|:---|:---|
| `Button` | Renders primary variant | Has correct background color, text color, border radius |
| `Button` | Disabled state | Has opacity 0.5, cursor not-allowed, click does nothing |
| ... | ... | ... |

---

### Section 7: Test Data & Fixtures

Define the test fixtures and seed data that tests will use:

```typescript
// Example fixture:
const TEST_FIXTURES = {
  unit_melee: {
    id: 'test_unit_1',
    name: 'Test Swordsman',
    attack: 10,
    defense: 5,
    // ... complete fixture matching entity model
  },
  // ... ALL fixtures needed
};
```

Define fixtures for:
- Every entity type in at least 2-3 variants (normal case, boundary case, edge case).
- State snapshots for different stages (initial state, mid-game state, end state if applicable).

---

### Section 8: Proto-Tests

Write actual test code stubs for ALL P0 business rules. These are not pseudocode — they are real, structurally complete test files that define the testing patterns and conventions.

Each proto-test should:
- Use the correct testing framework syntax (from tech stack).
- Include all describe/it/test blocks with descriptive names.
- Include assertion patterns (exact `expect` statements).
- Include comments explaining what each block validates and which rule it traces to.
- Use the fixtures defined in Section 7.

```typescript
// tests/engine/combat.spec.ts
import { describe, it, expect } from 'vitest';
import { calculateDamageModifier } from '../../src/engine/combat';
import { TEST_FIXTURES } from '../fixtures';

describe('Combat Engine', () => {
  describe('[RULE-COMBAT-01] Base Damage Modifier', () => {
    it('increases damage by 5% per point of attack advantage', () => {
      // Arrange: Attacker has 10 ATK, Defender has 5 DEF. Diff = 5.
      // Expected: +25% modifier → 1.25 multiplier
      const modifier = calculateDamageModifier(10, 5);
      expect(modifier).toBe(1.25);
    });

    it('caps positive bonus at +300% (60-point difference)', () => {
      // Arrange: Attacker has 80 ATK, Defender has 5 DEF. Diff = 75 (exceeds 60 cap).
      const modifier = calculateDamageModifier(80, 5);
      expect(modifier).toBe(4.0); // 1.0 base + 3.0 max bonus
    });

    it('reduces damage by 2.5% per point of defense advantage', () => {
      // Arrange: Attacker has 5 ATK, Defender has 15 DEF. Diff = 10.
      // Expected: -25% modifier → 0.75 multiplier
      const modifier = calculateDamageModifier(5, 15);
      expect(modifier).toBe(0.75);
    });

    it('caps negative penalty at -70% (28-point difference)', () => {
      const modifier = calculateDamageModifier(1, 50);
      expect(modifier).toBe(0.30); // 1.0 base - 0.70 max penalty
    });

    it('returns 1.0 when attack equals defense', () => {
      const modifier = calculateDamageModifier(10, 10);
      expect(modifier).toBe(1.0);
    });
  });

  // ... continue for ALL P0 rules
});
```

**Anti-shortcut directive**: Do not write only one `describe` block. Write a separate `describe` block for EVERY P0 rule, with ALL its test cases. The proto-tests section should be the longest section in this document.

---

### Section 9: CI/CD Testing Integration (if applicable)

Describe how and when tests run in the development workflow:

| Trigger | Tests Run | Failure Behavior |
|:---|:---|:---|
| Pre-commit hook | Lint + Type check | Block commit |
| PR / Push | Unit + Integration | Block merge |
| Nightly | Full suite + E2E | Alert team |
| Pre-deploy | Full suite | Block deploy |

If the project has no CI/CD (e.g., a local browser game), describe the manual testing workflow instead.

---

## Process

1. Read ALL previous stage outputs, especially `02_functional_design.md` (business rules, entity models, state machines, edge cases).
2. Build the traceability matrix FIRST — enumerate every rule and map it to tests.
3. Write test case specifications for all P0 rules.
4. Define test fixtures that cover normal, boundary, and edge cases.
5. Write the proto-test code stubs.
6. Present to user for approval.

## Self-Validation Checklist

Before presenting the output, verify ALL of these:

- [ ] EVERY `[RULE-XX]` from `02_functional_design.md` appears in the traceability matrix. Count them.
- [ ] Most rules have multiple rows in the matrix (happy path, edge cases, boundary values).
- [ ] Every P0 rule has a detailed test case specification.
- [ ] Negative testing covers ALL edge cases from the `[EDGE-XX]` catalog.
- [ ] State transition tests cover EVERY transition in EVERY state machine from `02_functional_design.md`.
- [ ] Test fixtures cover every entity type with at least 2-3 variants.
- [ ] Proto-tests are real, syntactically valid code stubs — not pseudocode.
- [ ] Proto-tests exist for ALL P0 rules, not just one or two examples.
- [ ] Every UI component from the Design System has rendering test cases.
- [ ] No section contains "etc.", "and more", or "as needed".
