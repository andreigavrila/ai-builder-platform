# Method Catalogue

## Tier 1: Closest end-to-end alternatives

### AWS AI-DLC

**Fit: 4.5/5**

An adaptive, methodology-first lifecycle divided into inception, construction, and operations. It covers greenfield and brownfield analysis, requirements, application design, units of work, functional and NFR design, implementation planning, testing, and validation. Extensions can add blocking security, resiliency, and testing rules.

Strong overlap:

- Adaptive treatment based on project complexity and risk.
- Structured requirements, design, NFR, implementation, and validation artifacts.
- Human control at lifecycle gates.
- Agent- and IDE-agnostic rules.
- Explicit support for existing repositories.

Material differences:

- Requires more routine stage approvals than V2's blocking-question policy.
- Does not expose an equivalent versioned core blueprint pinned by every change.
- No comparable cross-change staleness propagation.
- Validation does not have V2's explicit executor/validator separation.

### BMAD Method

**Fit: 4.5/5**

A complete, scale-adaptive AI development method using specialized analyst, product, architecture, UX, development, and testing roles. Its workflows span discovery through implementation and deployment-oriented work.

Strong overlap:

- Full lifecycle rather than code generation alone.
- Complexity-adaptive planning depth.
- Specialist roles and coordinated workflow routing.
- Extensive product, architecture, UX, implementation, and testing deliverables.

Material differences:

- More strongly organized around Agile roles and agent personas.
- Less formal machine-readable lifecycle and artifact ownership.
- No equivalent requirement-to-evidence graph in the core method.
- Independent acceptance authority and core-version staleness are not central concepts.

### GitHub Spec Kit

**Fit: 4/5**

A specification-driven toolkit centered on a project constitution followed by specification, clarification, planning, task generation, consistency analysis, implementation, and convergence.

Strong overlap:

- Explicit separation of requirements from technical planning.
- Structured clarification instead of silent guessing.
- Quality checklists and cross-artifact analysis.
- Implementation driven by generated tasks.
- Specifications treated as living source artifacts.

Material differences:

- The constitution is substantially narrower than V2's product, domain, architecture, quality, UX, engineering, and repository core.
- Validation is principally workflow analysis and convergence, not an independent acceptance role.
- No core-version pin, promotion gate, or active-change staleness model.

### GSD Core

**Fit: 4/5**

A context-engineering and specification-driven system built around a repeating Discuss, Plan, Execute, Verify, and Ship phase loop. Heavy work runs in fresh subagent contexts while persistent files preserve project state.

Strong overlap:

- Persistent state across agent sessions.
- Planning before implementation.
- Verification and fix planning before declaring completion.
- Context isolation for research, planning, and execution.
- Phase archives and repeatable workflow.

Material differences:

- Milestone- and phase-centric rather than governed by durable product/domain/architecture/NFR ownership.
- Less explicit requirement-to-test-to-evidence traceability.
- Verification is part of the same delivery system rather than institutionally independent.

### Google Conductor

**Fit: 4/5**

A Gemini CLI extension for Context-Driven Development. It maintains project-level product, product-guideline, technology-stack, and workflow files. Each feature or bug becomes a track with its own specification and implementation plan.

Strong overlap:

- Durable project context separated from change-local tracks.
- Specifications and plans created before implementation.
- Progress tracking, phase verification, review, and context synchronization.
- Existing project conventions become shared agent context.

Material differences:

- Tied to Gemini CLI.
- Project context is less comprehensive and formally versioned than V2's core.
- Lighter impact analysis, evidence requirements, and acceptance semantics.
- No explicit staleness propagation to concurrent tracks.

### RuFlo SPARC

**Fit: 4/5**

A five-phase method: Specification, Pseudocode, Architecture, Refinement, and Completion. Each phase has a quality gate and a specialized agent. Gate history, artifacts, ADRs, tests, and a traceability report are retained.

Strong overlap:

- Explicit stateful lifecycle and quality gates.
- Acceptance criteria, architecture, ADRs, implementation, testing, and review.
- Specialized phase agents.
- Gate history and traceability reporting.

Material differences:

- Prescribes pseudocode as a mandatory lifecycle phase.
- State and artifacts are closely coupled to RuFlo's orchestration and memory system.
- No clear durable-core/change-package split or post-acceptance knowledge promotion.

### OpenSpec

**Fit: 3.5/5**

A lightweight specification layer in which each change has a proposal, requirements and scenarios, design, and tasks. Completed changes are verified, archived, and used to update baseline specifications.

Strong overlap:

- Clear per-change artifact package.
- Alignment before implementation.
- Expanded workflow includes verification and archival.
- Accepted changes update longer-lived specifications.
- Tool- and agent-independent design.

Material differences:

- Intentionally avoids rigid phase gates.
- Lighter treatment of NFRs, security, operations, and repository evidence.
- No stable cross-artifact graph or independent acceptance role.
- Baseline update lacks V2's version impact and active-change staleness rules.

## Tier 2: Strong partial alternatives

### Superpowers

**Fit: 3.5/5**

A software-development methodology implemented as composable agent skills. It moves from collaborative design to a detailed plan, isolated worktree, test-driven implementation, fresh task subagents, specification review, code-quality review, and branch completion.

Best lesson for V2: execution discipline. Its two-stage review and evidence-before-completion rules are strong models for the execution and validation boundary.

Main gap: it does not maintain a durable product/domain/architecture blueprint or cross-change traceability.

### Kiro Specs

**Fit: 3/5**

A three-phase requirements, design, and tasks workflow. Feature specs use user stories and acceptance criteria; bug specs distinguish current, expected, and unchanged behavior. Design documents cover architecture, sequence diagrams, data flow, error handling, and testing.

Best lesson for V2: a compact and understandable feature/bug specification format.

Main gap: it is IDE-bound and lacks independent validation, core promotion, and formal cross-change governance.

### Agent OS

**Fit: 3/5**

A system for discovering standards from an existing codebase, organizing those standards, injecting relevant guidance, planning products, and shaping better specifications.

Best lesson for V2: automated extraction and selective injection of repository conventions rather than repeatedly loading all project documentation.

Main gap: it is a standards and specification layer, not an end-to-end implementation and acceptance lifecycle.

### Agentic Project Management

**Fit: 3.5/5**

A multi-agent project system with Planner, Manager, and persistent domain Worker roles. The Planner produces a Spec, Plan, and Rules. The Manager coordinates and reviews tasks. Workers execute, validate, log memory, and report results. Structured handoffs preserve accumulated context.

Best lesson for V2: explicit context ownership by role and durable handoffs between agent instances.

Main gap: its standard model requires the user to relay messages between conversations, and it has weaker artifact-version and acceptance governance.

## Tier 3: Useful components rather than complete alternatives

### Context Engineering / Product Requirements Prompt

**Fit: 2.5/5**

Builds a comprehensive implementation context from requirements, examples, external documentation, repository rules, and executable validation commands. The generated PRP drives implementation and self-correction.

Useful contribution: a strong template for self-contained implementation packages and validation loops.

### Taskmaster

**Fit: 2/5**

Transforms product requirements into tasks, dependencies, tags, workstreams, and automated execution loops.

Useful contribution: downstream task management after V2's planning gate.

### MetaGPT

**Fit: 2.5/5**

Models a software company through product-manager, architect, project-manager, and engineering agents coordinated by standard operating procedures. It can generate requirements, user stories, APIs, data structures, documents, and code.

Useful contribution: role-based artifact production and multi-agent SOP design.

### ChatDev

**Fit: 2/5**

A configurable multi-agent platform inspired by software-company roles and collaborative development workflows.

Useful contribution: experimentation with agent collaboration patterns. Its primary abstraction is agent conversation, not durable artifact governance.

### Roo Code Boomerang Tasks

**Fit: 1.5/5**

An orchestration mechanism that decomposes a complex request into isolated subtasks handled by specialized architecture, code, debug, or documentation modes. The parent resumes from each subtask's summary.

Useful contribution: an execution substrate for specialist V2 workflows, not a replacement for the lifecycle itself.
