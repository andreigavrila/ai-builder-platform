# Simple Applicant Tracking System

I want to create a simple applicant tracking system for managing recruiting work across multiple customer organizations.

The product should help customer-users track candidates, job openings, hiring workflows, company contacts, internal contacts, and the day-to-day status of recruitment activity. It should be useful for a small recruiting team that needs shared visibility into who is being considered, where each candidate stands, and who is involved in the process.

The system should support multiple customer-users within the same customer organization. Users should be able to collaborate on the same candidate and job records while keeping their organization's data separate from other customer organizations.

Candidates should have basic profile information, contact details, current recruiting status, and a simple history of relevant activity. Candidates may be associated with one or more job openings or hiring workflows.

Hiring workflows should be configurable enough to represent common recruiting stages such as sourced, contacted, screening, interview, offer, hired, rejected, or withdrawn. The workflow model should stay simple and understandable rather than trying to cover every possible recruiting edge case.

The product should include company contacts who represent people at client or hiring companies, such as hiring managers or business stakeholders. It should also include internal contacts who represent people inside the recruiting organization, such as recruiters, account managers, coordinators, or interviewers.

Users should be able to record simple notes, interactions, and next steps so a team can understand recent activity without relying on memory or external spreadsheets.

The product should make it clear which customer organization owns each job, candidate relationship, contact, workflow, and activity record. Basic role separation should exist, but the first version should avoid complex enterprise permission models.

The initial product should not include:

- Payroll, onboarding, HRIS, or employee lifecycle management.
- Advanced CRM automation or marketing campaigns.
- AI candidate matching, scoring, or ranking.
- Job board posting or paid advertising integrations.
- Email inbox synchronization, calendar synchronization, or external communication sending.
- Complex compliance workflows, background checks, or document signing.
- Public candidate portals.
- Mobile apps.
- Deep reporting, analytics dashboards, or forecasting.

The result should be a straightforward ATS foundation that can be expanded later through the blueprint system. Use the v2 workflow to turn this request into a project blueprint and later scoped implementation changes. Do not implement the application yet.
