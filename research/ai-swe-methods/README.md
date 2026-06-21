# AI Software-Engineering Method Research

This folder is a working knowledge base for comparing AI-assisted software-development methods with this repository's V2 AI-SWE lifecycle.

## Contents

- [catalog.md](catalog.md) — categorized summaries of the surveyed methods.
- [comparison-matrix.md](comparison-matrix.md) — capability-by-capability comparison against V2.
- [learning-path.md](learning-path.md) — a practical sequence for studying and testing the methods.
- [sources.md](sources.md) — official sources and research provenance.

## Local baseline

The comparison baseline is defined by:

- [V2 orchestrator](../../.agents/workflows/v2/skill_ai_swe_orchestrator.md)
- [Artifact contract](../../.agents/workflows/v2/references/artifact-contract.md)
- [Lifecycle and quality gates](../../.agents/workflows/v2/references/lifecycle-contract.md)
- [Independent validation contract](../../.agents/workflows/v2/references/validation-contract.md)

V2 is treated as an evidence-gated lifecycle with:

1. A durable, versioned core project blueprint.
2. A separate package for each requested change.
3. Risk- and scope-adaptive change profiles.
4. Requirements, impact, design, planning, execution, and validation stages.
5. Stable traceability from outcomes through implementation evidence.
6. Validation independent from the implementation narrative.
7. Controlled promotion of accepted knowledge into the core blueprint.
8. Staleness detection when core knowledge changes.

## Current conclusion

The closest practical alternatives are AWS AI-DLC, BMAD, GitHub Spec Kit, GSD Core, Google Conductor, OpenSpec, and RuFlo SPARC.

No method in this initial survey documents the complete V2 combination. A concise positioning is:

> AI-DLC/BMAD lifecycle breadth + Conductor/OpenSpec artifact organization + GSD/Superpowers execution discipline + stronger independent validation and configuration-management semantics.

## Research status

- Initial survey date: 2026-06-21
- Scope: publicly documented AI-first software-development methods and workflow frameworks
- Evidence preference: official documentation and canonical repositories
- Ratings: comparative judgments, not benchmark results
