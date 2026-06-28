# Simple Applicant Tracking System Domain Blueprint

- **Artifact ID**: CORE-SIMPLE-ATS-02-DOMAIN
- **Version**: 1
- **Status**: ready
- **Core Version**: 1
- **Last Updated**: 2026-06-27
- **Source References**: requirements/simple-ats/requirements.md; .agents/blueprints/simple-ats/01-core/01-product.md

## Purpose

This artifact defines the shared recruiting-domain language and durable rules for the simple applicant tracking system. Future requirements, designs, implementation tasks, tests, and validation should use these concepts and rules unless a later accepted change updates the core blueprint.

The domain blueprint is intentionally not a fuller restatement of the product blueprint. Product scope, target users, product epics, dependencies, and risks live in `01-product.md`. This artifact constrains domain modeling: which recruiting concepts exist, how they relate, what states matter, who has authority, and which excluded concepts must not be silently introduced as domain objects or events.

## Core concepts and entities

| Concept | Type | Meaning | Why it matters |
|:---|:---|:---|:---|
| Customer organization | Entity | A tenant-like organization that owns recruiting records and customer-users. | It is the primary boundary for data ownership, access, and collaboration. |
| Customer-user | Actor | A person who uses the ATS within a customer organization. | User identity and organization membership determine access and collaboration context. |
| Role | Policy | A simple classification of customer-user authority, such as organization administration or recruiting work. | Basic role separation protects organization setup without introducing enterprise permission complexity. |
| Candidate | Entity | A person represented in a customer organization's recruiting records. | Candidates are central to ATS work and carry profile, contact, relationship, and activity context. |
| Candidate profile | Record | Basic identifying and descriptive candidate information. | It gives customer-users a shared reference for who the candidate is. |
| Candidate contact details | Value object | Contact information recorded for reaching a candidate. | Recruiting work needs contact details even when communication sending is out of scope. |
| Job opening | Entity | A recruiting opportunity or position being filled in a customer organization's recruiting work. | Jobs provide the context for candidate consideration and workflow progress. |
| Candidate relationship | Relationship entity | The association between a candidate and a recruiting context such as a job opening or hiring workflow. | A candidate may have different progress, outcomes, and activity in different contexts. |
| Hiring workflow | Entity | A simple stage model used to track recruiting progress. | Workflows make candidate progress visible and consistent. |
| Workflow stage | State | One named position in a hiring workflow. | Stages define the allowed status values for a candidate relationship. |
| Company contact | Entity | A person at a client or hiring company, such as a hiring manager or business stakeholder. | Company contacts connect recruiting work to external hiring stakeholders without making them system users. |
| Internal contact | Entity | A person inside the recruiting organization, such as a recruiter, account manager, coordinator, or interviewer. | Internal contacts clarify ownership, involvement, and follow-up responsibilities without necessarily being login users. |
| Activity record | Record | A note, interaction, or next step recorded against recruiting context. | Activity records preserve shared recruiting history. |
| Note | Record | Freeform recruiting context captured by a customer-user. | Notes support team understanding without implying external communication. |
| Interaction | Event | A recorded recruiting touchpoint or event. | Interactions show what happened from the recruiting team's perspective, even when sending or syncing communication is out of scope. |
| Next step | Record | A recorded follow-up action or reminder-like item. | Next steps help customer-users understand expected recruiting work. |

## Out-of-scope domain concepts

- A global cross-customer candidate identity is not established; candidate identity is customer-organization-local unless a later accepted change creates a shared identity model.
- Employee lifecycle concepts such as employee, payroll record, onboarding task, benefit, performance review, and post-hire HR record are not ATS domain concepts.
- AI screening concepts such as candidate score, candidate rank, automated match recommendation, or automated hiring decision are not ATS domain concepts.
- External communication proof concepts such as sent email, synced calendar event, delivered message, or campaign event are not established domain events.
- Public candidate self-service actors, application submissions, candidate portal accounts, and public application-form sessions are not established domain concepts.
- Background check, identity verification, document signing, and regulated compliance-case concepts are not established domain concepts.
- Complex permission policy concepts such as custom permission matrices, field-level permissions, approval chains, and delegated administration are not part of the first-version domain.

## Relationships

| Relationship ID | From | Relationship | To | Cardinality | Meaning |
|:---|:---|:---|:---|:---|:---|
| 02DOM-REL-SIMPLE-ATS-001 | Customer organization | owns | Customer-user | one-to-many | Customer-users act inside a customer organization. |
| 02DOM-REL-SIMPLE-ATS-002 | Customer organization | owns | Candidate | one-to-many | Candidate identity and access are scoped to one customer organization. |
| 02DOM-REL-SIMPLE-ATS-003 | Customer organization | owns | Job opening | one-to-many | Job openings are customer-organization records. |
| 02DOM-REL-SIMPLE-ATS-004 | Candidate | has | Candidate relationship | one-to-many | One candidate can be considered in multiple recruiting contexts. |
| 02DOM-REL-SIMPLE-ATS-005 | Candidate relationship | references | Job opening | many-to-one or optional | A candidate relationship can track candidacy for a specific job opening when job context is present. |
| 02DOM-REL-SIMPLE-ATS-006 | Candidate relationship | uses current stage from | Hiring workflow | many-to-one | Candidate progress must use stages from an applicable workflow. |
| 02DOM-REL-SIMPLE-ATS-007 | Hiring workflow | contains | Workflow stage | one-to-many | Workflow stages define allowed progress values. |
| 02DOM-REL-SIMPLE-ATS-008 | Customer organization | owns | Company contact | one-to-many | Company contacts are scoped to the customer organization's recruiting work. |
| 02DOM-REL-SIMPLE-ATS-009 | Customer organization | owns | Internal contact | one-to-many | Internal contacts are scoped to the customer organization's recruiting work. |
| 02DOM-REL-SIMPLE-ATS-010 | Activity record | attaches to | Recruiting context | many-to-one-or-more | Notes, interactions, and next steps must be connected to candidate, job, contact, or workflow context. |
| 02DOM-REL-SIMPLE-ATS-011 | Activity record | authored by | Customer-user | many-to-one | Activity history needs a responsible author. |
| 02DOM-REL-SIMPLE-ATS-012 | Customer-user | has | Role | many-to-one-or-more | Roles express simple authority within a customer organization. |

## States and transitions

### Candidate relationship

```text
sourced -> contacted -> screening -> interview -> offer -> hired
sourced|contacted|screening|interview|offer -> rejected
sourced|contacted|screening|interview|offer -> withdrawn
```

- `sourced`: The candidate has been identified for a recruiting context.
- `contacted`: Contact has been recorded, but communication sending is not implied.
- `screening`: Initial qualification or review is in progress.
- `interview`: Interview-stage activity is in progress.
- `offer`: Offer-stage activity is in progress.
- `hired`: The candidate relationship ended with a hire.
- `rejected`: The candidate relationship ended because the hiring side declined to proceed.
- `withdrawn`: The candidate relationship ended because the candidate or process was withdrawn.

### Job opening

```text
open -> paused -> open
open|paused -> closed
```

- `open`: Recruiting work is active.
- `paused`: Recruiting work is temporarily not active.
- `closed`: Recruiting work for the opening has ended.

### Next step

```text
open -> completed
open -> canceled
```

- `open`: The next step is still expected.
- `completed`: The next step has been handled.
- `canceled`: The next step is no longer needed.

## Domain events

| Event | Source | When it occurs | Meaning | External contract |
|:---|:---|:---|:---|:---|
| CustomerUserAdded | Customer organization | A user is added to an organization workspace. | A person gains organization-scoped system access. | No |
| CandidateCreated | Customer-user | A candidate record is created. | A customer organization begins tracking a candidate. | No |
| JobOpeningCreated | Customer-user | A job opening is created. | A recruiting opportunity becomes trackable. | No |
| CandidateRelationshipCreated | Customer-user | A candidate is associated with a job opening or workflow context. | Candidate progress can now be tracked separately for that context. | No |
| CandidateWorkflowStageChanged | Customer-user or workflow rule | A candidate relationship moves to another workflow stage. | Recruiting progress changed. | No |
| ContactCreated | Customer-user | A company contact or internal contact is created. | A person involved in recruiting work becomes referenceable. | No |
| ActivityRecordAdded | Customer-user | A note, interaction, or next step is recorded. | Shared recruiting history has changed. | No |
| NextStepCompleted | Customer-user | An open next step is completed. | Expected follow-up was handled. | No |
| JobOpeningClosed | Customer-user | A job opening reaches a closed state. | Recruiting work for that opening ended. | No |

## Core rules and constraints

| Rule ID | Applies to | Rule | Rationale |
|:---|:---|:---|:---|
| 02DOM-RULE-SIMPLE-ATS-001 | Customer-user; 02DOM-REL-SIMPLE-ATS-001 | Every customer-user must belong to at least one customer organization before accessing organization-owned recruiting records. | Access needs an organization context. |
| 02DOM-RULE-SIMPLE-ATS-002 | Customer organization; 02DOM-REL-SIMPLE-ATS-002; 02DOM-REL-SIMPLE-ATS-003; 02DOM-REL-SIMPLE-ATS-008; 02DOM-REL-SIMPLE-ATS-009 | Every candidate, job opening, candidate relationship, hiring workflow, contact, and activity record must be owned by exactly one customer organization. | Tenant ownership is the domain boundary for records. |
| 02DOM-RULE-SIMPLE-ATS-003 | Customer-user; Customer organization | A customer-user must not access, modify, or list records owned by a customer organization they are not authorized to use. | Cross-organization access would violate the core domain boundary. |
| 02DOM-RULE-SIMPLE-ATS-004 | Candidate | A candidate profile belongs to one customer organization; the same real-world person in different customer organizations is not automatically a shared cross-customer candidate. | No global candidate identity is established. |
| 02DOM-RULE-SIMPLE-ATS-005 | Candidate relationship; 02DOM-REL-SIMPLE-ATS-004 | A candidate relationship must reference exactly one candidate and at least one recruiting context, such as a job opening or hiring workflow. | Candidate progress is context-specific. |
| 02DOM-RULE-SIMPLE-ATS-006 | Job opening; 02DOM-REL-SIMPLE-ATS-003 | A job opening must belong to exactly one customer organization. | Jobs cannot float outside the ownership boundary. |
| 02DOM-RULE-SIMPLE-ATS-007 | Hiring workflow; Workflow stage; 02DOM-REL-SIMPLE-ATS-007 | A hiring workflow must contain simple, human-readable workflow stages. | Workflow progress must stay understandable. |
| 02DOM-RULE-SIMPLE-ATS-008 | Candidate relationship; Workflow stage; 02DOM-REL-SIMPLE-ATS-006 | A candidate relationship's workflow status must be one of the stages allowed by the applicable hiring workflow. | Status values need a governing workflow. |
| 02DOM-RULE-SIMPLE-ATS-009 | Candidate relationship state | Hired, rejected, and withdrawn are terminal candidate relationship outcomes unless a later accepted change defines reopening behavior. | Terminal outcomes need stable interpretation. |
| 02DOM-RULE-SIMPLE-ATS-010 | Company contact; Internal contact | Company contacts and internal contacts must be distinguishable in the domain. | The same word "contact" covers people with different involvement and authority. |
| 02DOM-RULE-SIMPLE-ATS-011 | Activity record; 02DOM-REL-SIMPLE-ATS-010; 02DOM-REL-SIMPLE-ATS-011 | An activity record must have an owning customer organization, an authoring customer-user, and at least one relevant recruiting context. | Activity history must be attributable and contextual. |
| 02DOM-RULE-SIMPLE-ATS-012 | Activity record; Interaction | Activity records may document notes, interactions, and next steps, but they must not imply the product sent an email, synchronized a calendar event, or performed an external communication action. | Recorded history is not proof of external communication. |
| 02DOM-RULE-SIMPLE-ATS-013 | Role; 02DOM-REL-SIMPLE-ATS-012 | Basic role separation may restrict organization administration separately from day-to-day recruiting work. | Administration authority is distinct from recruiting activity authority. |
| 02DOM-RULE-SIMPLE-ATS-014 | Out-of-scope AI screening concepts | The domain must not include automated candidate ranking, screening, matching, or hiring-decision authority. | The product explicitly excludes AI hiring decision behavior. |

## Ownership, authority, and boundaries

- Customer organization ownership is the governing data boundary for candidates, job openings, candidate relationships, hiring workflows, contacts, activity records, customer-users, and basic role assignments.
- A customer-user can create and update recruiting records only within an authorized customer organization.
- A customer organization administrator has authority over organization-level access and basic role separation.
- Recruiters and recruiting team members have authority over day-to-day candidate, job, workflow, contact, and activity records when permitted by their customer organization role.
- The product has authority to enforce customer organization data boundaries, validate workflow stages, and prevent cross-organization record access.
- Candidate records do not create a global cross-customer identity unless a later accepted product decision introduces that capability.
- Company contacts and internal contacts represent people involved in recruiting work; they do not automatically become customer-users with login access.
- The product does not have authority to send external communications, post jobs externally, rank candidates, conduct background checks, sign documents, or make hiring decisions.

## Assumptions and open questions

| ID | Type | Importance | Applies to | Current position | Why it matters | Resolution path |
|:---|:---|:---|:---|:---|:---|:---|
| 02DOM-ASSUMPTION-SIMPLE-ATS-001 | Assumption | Medium | Hiring workflow; Workflow stage | The initial workflow stages can use sourced, contacted, screening, interview, offer, hired, rejected, and withdrawn as a default stage set. | Stage choices affect candidate relationship states and tests. | Revisit during first implementation change design. |
| 02DOM-ASSUMPTION-SIMPLE-ATS-002 | Assumption | High | Candidate relationship | A candidate associated with multiple jobs should have separate candidate relationships for each job or workflow context. | This determines whether progress is candidate-global or context-specific. | Confirm before data model and API design. |
| 02DOM-ASSUMPTION-SIMPLE-ATS-003 | Assumption | Medium | Company contact; Internal contact | Company contacts and internal contacts are contact records, not authenticated users by default. | Treating contacts as users would change authority and access rules. | Revisit only if contact login or collaboration is requested. |
| 02DOM-ASSUMPTION-SIMPLE-ATS-004 | Assumption | Medium | Role | Basic role separation can start with organization administrator and standard recruiting user. | Role depth affects authority and UX complexity. | Refine during authorization design. |
| 02DOM-ASSUMPTION-SIMPLE-ATS-005 | Assumption | Low | Activity record | Notes, interactions, and next steps can share an activity-history concept while remaining distinguishable by type. | This affects activity organization but not the core domain boundary. | Revisit during activity UX and data design. |
| 02DOM-QUESTION-SIMPLE-ATS-001 | Question | Medium | Candidate profile; Job opening; Company contact; Internal contact | Exact required fields are not defined yet. | Required fields affect validation and data quality. | Answer during first scoped implementation specification. |
| 02DOM-QUESTION-SIMPLE-ATS-002 | Question | Medium | Hiring workflow | Workflows may be organization-wide defaults, job-specific configurations, or both. | Workflow ownership affects relationship and configuration rules. | Decide before implementing workflow configuration. |
| 02DOM-QUESTION-SIMPLE-ATS-003 | Question | Medium | Candidate relationship state | It is not yet decided whether users can move backward between non-terminal workflow stages. | Transition rules affect history, validation, and UI actions. | Decide before implementing workflow transitions. |
| 02DOM-QUESTION-SIMPLE-ATS-004 | Question | Medium | Candidate | Duplicate candidate handling inside one customer organization is not defined. | Duplicate policy affects identity, search, and data cleanup behavior. | Decide when candidate search or merge behavior is scoped. |
| 02DOM-QUESTION-SIMPLE-ATS-005 | Question | High | Candidate; Contact; Activity record | Retention, deletion, and anonymization expectations for personal data are not defined. | Privacy expectations may affect data lifecycle and authority. | Resolve before production handling of real candidate/contact data. |

## Generation stop conditions

| Condition | Status | Why it stops generation | Current assessment |
|:---|:---|:---|:---|
| Customer organization ownership boundary is unresolved | Clear | Data ownership changes would alter nearly every relationship and access rule. | The requirement clearly states customer organization data separation. |
| Candidate progress model is unresolved | Clear | Whether progress is candidate-global or relationship-specific changes core entities and state rules. | The domain uses candidate relationships as the reversible default; confirm before data/API design. |
| Contact authority is unresolved | Clear | Treating contacts as login users would change actor, access, and authority modeling. | Contacts are modeled as records, not authenticated users, unless a later change expands scope. |
| Personal-data lifecycle is required for production use but unanswered | Clear | Retention, deletion, and anonymization can change lifecycle and authority rules. | Not blocking core blueprint generation, but must be resolved before production handling of real candidate/contact data. |
