# Sources and Provenance

Official sources were preferred over third-party summaries. All links were inspected during the initial survey on 2026-06-21 unless otherwise noted.

## Primary sources

| Method | Official source | Evidence used |
|---|---|---|
| AWS AI-DLC | [Canonical repository](https://github.com/awslabs/aidlc-workflows) | Adaptive three-phase workflow, artifacts, extensions, approvals, tenets |
| BMAD Method | [Canonical repository](https://github.com/bmad-code-org/BMAD-METHOD) and [documentation](https://docs.bmad-method.org) | Scale adaptation, specialist roles, structured workflows, complete lifecycle |
| GitHub Spec Kit | [Canonical repository](https://github.com/github/spec-kit) and [SDD description](https://github.com/github/spec-kit/blob/main/spec-driven.md) | Constitution, specification, planning, tasks, analysis, implementation, convergence |
| GSD Core | [Canonical repository](https://github.com/open-gsd/gsd-core) | Phase loop, fresh contexts, persistent state, verification and shipping |
| Google Conductor | [Canonical repository](https://github.com/gemini-cli-extensions/conductor) | Project context, tracks, specifications, plans, implementation and review |
| RuFlo SPARC | [Plugin documentation](https://github.com/ruvnet/ruflo/tree/main/plugins/ruflo-sparc) | Five phases, gates, specialized agents, ADRs and traceability report |
| OpenSpec | [Canonical repository](https://github.com/Fission-AI/OpenSpec) | Change packages, expanded workflow, verification, archive and baseline updates |
| Superpowers | [Canonical repository](https://github.com/obra/superpowers) | Design, planning, worktrees, TDD, subagents, layered review and completion |
| Kiro Specs | [Official documentation](https://kiro.dev/docs/specs/) | Requirements or bug analysis, design, tasks and acceptance criteria |
| Agent OS | [Canonical repository](https://github.com/buildermethods/agent-os) and [official site](https://buildermethods.com/agent-os) | Standards discovery/injection, product planning and spec shaping |
| Agentic Project Management | [Canonical repository](https://github.com/sdi2200262/agentic-project-management) | Planner/Manager/Worker roles, persistent memory, task validation and handoffs |
| Context Engineering / PRP | [Canonical template](https://github.com/coleam00/context-engineering-intro) | Requirements context, examples, documentation, implementation and validation loops |
| Taskmaster | [Canonical repository](https://github.com/eyaltoledano/claude-task-master) | PRD-derived tasks, dependencies, workstreams and execution support |
| MetaGPT | [Canonical repository](https://github.com/FoundationAgents/MetaGPT) | Software-company roles, SOPs and generated engineering artifacts |
| ChatDev | [Canonical repository](https://github.com/OpenBMB/ChatDev) | Configurable multi-agent workflows and software-development roles |
| Roo Boomerang Tasks | [Official documentation](https://docs.roocode.com/features/boomerang-tasks) | Orchestrator mode, isolated subtasks, specialist modes and context transfer |

## Research limitations

- The ecosystem changes quickly; repository behavior may move ahead of documentation.
- Fit ratings describe similarity to local V2, not overall method quality.
- The initial survey evaluates documented capabilities, not controlled implementation outcomes.
- Vendor claims have not yet been independently benchmarked.
- Tool maturity, maintenance activity, licensing, security, and cost need a separate evaluation.

## Update protocol

When updating this research:

1. Record the review date.
2. Prefer tagged documentation or a commit permalink for claims that may change.
3. Separate documented behavior from experimentally observed behavior.
4. Add evidence from controlled experiments to a future `experiments/` directory.
5. Revisit matrix ratings only when new documentation or experiment evidence justifies the change.
