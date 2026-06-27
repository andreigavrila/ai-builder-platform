# Simple Applicant Tracking System Product Blueprint

- **Artifact ID**: CORE-SIMPLE-ATS-01-PRODUCT
- **Version**: 1
- **Status**: ready
- **Core Version**: 1
- **Last Updated**: 2026-06-27
- **Source References**: requirements/simple-ats/requirements.md

## Purpose

**Problem being solved**: Small recruiting teams working across candidates, openings, customer organizations, company contacts, and internal collaborators can lose shared visibility when activity is spread across spreadsheets, memory, messages, and disconnected notes. This makes it harder to know who owns each relationship, where a candidate stands, which workflow stage applies, and what next step is expected.

**Product purpose**: The product provides a straightforward applicant tracking system foundation for managing candidates, job openings, hiring workflows, contacts, and recruiting activity across multiple customer organizations. It should help customer-users collaborate around shared recruiting records while keeping each customer organization's data separate and avoiding advanced enterprise, automation, or integration scope in the first version.

## Target users

| Persona | Description | Key needs | Pain points |
|:---|:---|:---|:---|
| Recruiter | A customer-user responsible for sourcing, screening, updating, and progressing candidates through hiring workflows. | Track candidate profiles, statuses, job associations, notes, interactions, and next steps. | Candidate context can become scattered, stale, or hard to interpret when work is tracked outside a shared system. |
| Recruiting team lead | A customer-user responsible for team coordination, workload visibility, and process consistency across openings and candidates. | See recruiting progress, understand ownership, maintain simple workflow discipline, and keep customer organization data separated. | It is difficult to coordinate recruiting work when each user tracks candidates and contacts differently. |
| Account or hiring stakeholder coordinator | A customer-user who works with company contacts, hiring managers, internal contacts, and recruiting follow-up. | Connect candidates, job openings, company contacts, and internal contacts in one shared context. | Relationship context is easy to lose when external company contacts and internal collaborators are not connected to candidate activity. |
| Customer organization administrator | A customer-user who manages access and basic organization-level setup. | Support multiple users in the same customer organization with clear ownership and basic role separation. | Without tenant boundaries and simple access control, shared recruiting systems can expose or confuse customer-owned data. |

## Outcomes

1. `OUTCOME-SIMPLE-ATS-001` - Customer-users can manage candidates and job openings in a shared recruiting workspace.
2. `OUTCOME-SIMPLE-ATS-002` - Recruiting teams can see where candidates stand in simple hiring workflows.
3. `OUTCOME-SIMPLE-ATS-003` - Company contacts, internal contacts, notes, interactions, and next steps are connected to recruiting work.
4. `OUTCOME-SIMPLE-ATS-004` - Data owned by one customer organization remains separated from other customer organizations.
5. `OUTCOME-SIMPLE-ATS-005` - The product remains a simple ATS foundation rather than expanding into HRIS, CRM automation, AI matching, job advertising, or communication-platform scope.

## Product epics

1. `EPIC-SIMPLE-ATS-001` - Customer organization workspace

   Description: Customer organization administrators and customer-users can work inside a customer-owned workspace that contains that organization's candidates, jobs, contacts, workflows, and activity records. Successful use keeps records clearly owned by one customer organization and separated from other customer organizations.

   Sample user stories:

   - Sample: As a customer-user, I want to work only with my organization's recruiting records, so that another customer organization's data is not visible or mixed into my workflow.
   - Sample: As a customer organization administrator, I want multiple users in my organization to collaborate in the same workspace, so that recruiting work is shared without losing ownership boundaries.

2. `EPIC-SIMPLE-ATS-002` - Candidate management

   Description: Recruiters can create and maintain candidate records with basic profile information, contact details, current recruiting status, and relevant history. Successful candidate management gives the team a shared view of who the candidate is, how to contact them, and what recruiting context exists.

   Sample user stories:

   - Sample: As a recruiter, I want to record candidate profile and contact details, so that the team has a single reference for candidate information.
   - Sample: As a recruiter, I want to see a candidate's current status and recent history, so that I can decide the next recruiting action.

3. `EPIC-SIMPLE-ATS-003` - Job openings and candidate associations

   Description: Recruiters and team leads can manage job openings and associate candidates with one or more jobs or hiring workflows. Successful use makes it clear which opportunity a candidate is being considered for and how that consideration is progressing.

   Sample user stories:

   - Sample: As a recruiter, I want to associate a candidate with a job opening, so that their candidacy is tracked in the right hiring context.
   - Sample: As a recruiting team lead, I want to see candidates connected to an opening, so that I can understand recruiting coverage.

4. `EPIC-SIMPLE-ATS-004` - Simple hiring workflows

   Description: Recruiters and team leads can use simple configurable workflow stages for common recruiting progress such as sourced, contacted, screening, interview, offer, hired, rejected, or withdrawn. Successful workflow use gives teams enough structure to understand progress without requiring complex process modeling.

   Sample user stories:

   - Sample: As a recruiter, I want to move a candidate through simple hiring stages, so that everyone can see where the candidate stands.
   - Sample: As a recruiting team lead, I want workflow stages to stay understandable, so that the team can use the system consistently.

5. `EPIC-SIMPLE-ATS-005` - Company and internal contacts

   Description: Customer-users can manage company contacts representing client or hiring-company people and internal contacts representing people inside the recruiting organization. Successful contact management links the people involved in recruiting work to candidates, jobs, and activity context.

   Sample user stories:

   - Sample: As an account or hiring stakeholder coordinator, I want to record company contacts such as hiring managers, so that recruiting records show who is involved externally.
   - Sample: As a recruiter, I want to reference internal contacts such as recruiters, coordinators, or interviewers, so that ownership and involvement are clear.

6. `EPIC-SIMPLE-ATS-006` - Recruiting activity history

   Description: Customer-users can record simple notes, interactions, and next steps for candidates, jobs, contacts, and workflows. Successful activity tracking lets a team understand recent recruiting activity without relying on memory or external spreadsheets.

   Sample user stories:

   - Sample: As a recruiter, I want to add notes and next steps to a candidate record, so that another team member can understand recent activity.
   - Sample: As a recruiting team lead, I want activity history to be visible in context, so that I can review progress without asking for manual updates.

7. `EPIC-SIMPLE-ATS-007` - Basic role separation

   Description: Customer organization administrators and users have enough role separation to support basic organization administration and day-to-day recruiting work. Successful role separation protects core workspace administration without introducing complex enterprise permission modeling.

   Sample user stories:

   - Sample: As a customer organization administrator, I want basic control over who can access the organization workspace, so that recruiting data is not open to unintended users.
   - Sample: As a customer-user, I want permissions to be simple, so that I can do recruiting work without navigating a complex access model.

## Scope boundaries

1. `BOUNDARY-SIMPLE-ATS-001` - The product does not include payroll, onboarding, HRIS, employee lifecycle management, performance management, benefits, or post-hire employee administration.
2. `BOUNDARY-SIMPLE-ATS-002` - The product does not include advanced CRM automation, marketing campaigns, lead scoring, sales pipeline automation, or outreach campaign management.
3. `BOUNDARY-SIMPLE-ATS-003` - The product does not include AI candidate matching, candidate scoring, ranking, recommendations, automated screening, or hiring-decision automation.
4. `BOUNDARY-SIMPLE-ATS-004` - The product does not include job board posting, paid job advertising, applicant source marketplaces, or external job distribution integrations.
5. `BOUNDARY-SIMPLE-ATS-005` - The product does not include email inbox synchronization, calendar synchronization, external communication sending, or communication-platform automation.
6. `BOUNDARY-SIMPLE-ATS-006` - The product does not include complex compliance workflows, background checks, identity verification, document signing, or regulated hiring-process automation.
7. `BOUNDARY-SIMPLE-ATS-007` - The product does not include public candidate portals, candidate self-service, public application forms, or mobile apps.
8. `BOUNDARY-SIMPLE-ATS-008` - The product does not include deep reporting, analytics dashboards, forecasting, workforce planning, or executive business-intelligence features.
9. `BOUNDARY-SIMPLE-ATS-009` - The first version should avoid complex enterprise permission models beyond basic role separation.

## Product dependencies

1. `DEPENDENCY-SIMPLE-ATS-001` - No external product dependencies established yet: The current ATS foundation does not require a named external product, public interface, job-board ecosystem, communication provider, HRIS, calendar, email system, compliance provider, or AI service. This preserves the initial scope as an internally managed recruiting workspace; later changes that add integrations or regulated workflows must introduce explicit product dependencies.

## Product risks

| Risk ID | Risk | Probability | Impact | Rationale | Product impact | Watch/response |
|:---|:---|:---|:---|:---|:---|:---|
| RISK-SIMPLE-ATS-002 | Privacy and sensitive data exposure | High | High | Candidate, contact, and recruiting activity records naturally contain personal and commercially sensitive information. | Poor handling of access, retention, or deletion could create legal, operational, and reputational harm. | Treat privacy and retention as first-class quality requirements before implementation; watch for fields or activity types that collect unnecessary personal data. |
| RISK-SIMPLE-ATS-001 | Tenant isolation failure | Medium | High | The product explicitly supports multiple customer organizations, so customer ownership boundaries are central to the value proposition. | One customer seeing or changing another customer's recruiting data would break trust and could make the multi-customer product unusable. | Require tenant ownership rules in domain, architecture, tests, and validation; watch for records that lack customer organization ownership. |
| RISK-SIMPLE-ATS-005 | Activity history noise | High | Medium | Notes, interactions, and next steps are easy to add but can become hard to scan if they are not organized around candidate, job, and contact context. | The system could capture more data while still failing to give teams useful shared visibility. | Keep activity types simple and contextual; watch for long undifferentiated timelines or users reverting to external notes. |
| RISK-SIMPLE-ATS-003 | Workflow complexity creep | Medium | Medium | Hiring workflows can quickly expand from simple stages into process automation, exceptions, approvals, and custom rules. | Delivery could slow and the product could become harder for small recruiting teams to understand. | Keep workflow changes tied to explicit recruiting scenarios; route automation or compliance-heavy workflow requests through separate scoped changes. |
| RISK-SIMPLE-ATS-004 | Contact model ambiguity | Medium | Medium | Company contacts, internal contacts, candidates, and customer-users are related people concepts with different authority and usage. | Confusing these concepts could create inconsistent data, mistaken access expectations, and lower user confidence. | Preserve separate domain terms and authority rules; watch for requirements that treat contacts as login users or candidates without an explicit conversion decision. |
