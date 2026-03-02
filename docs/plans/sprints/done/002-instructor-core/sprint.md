---
id: '002'
title: Instructor Core
status: done
branch: sprint/002-instructor-core
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-004
- SUC-005
- SUC-006
---

# Sprint 002: Instructor Core

## Goals

Replace the instructor dashboard stub with a fully functional instructor
workflow: view assigned students, draft and send monthly progress reviews,
manage reusable email templates, navigate by month, and confirm weekly TA
attendance via a check-in prompt. By the end of this sprint, an instructor
can log in and complete their entire monthly reporting workflow.

## Problem

Sprint 001 established routing stubs. Instructors currently see a placeholder
page after login. No review, template, or TA check-in functionality exists.

## Solution

1. **Instructor dashboard** — Replace the stub with a real dashboard showing
   monthly stats: how many students are assigned, how many reviews are
   pending/draft/sent for the selected month. Includes a month picker.

2. **Review editor** — A page per student where an instructor can draft a
   progress email, save it as a draft, and mark it sent. Review status flows
   through `pending → draft → sent`.

3. **Template management** — CRUD UI for reusable email templates with
   subject and body fields supporting `{{studentName}}` and `{{month}}`
   placeholder variables.

4. **Weekly TA check-in banner** — A dismissible dashboard banner appears
   when the current week's TA check-in hasn't been submitted. Lists TAs from
   `instructor_students` (empty until Sprint 005). Instructor confirms each
   TA as present/absent. If a TA has no profile, instructor can tap "Notify
   Admin" to send an in-app message requesting profile creation.

5. **Schema additions** — Add `ta_checkins` and `admin_notifications` tables
   to the Drizzle schema and run a new migration.

## Success Criteria

- Logged-in instructor sees a real dashboard with month picker and review
  status counts
- Instructor can create/edit/save a draft review for a student and advance
  it to sent
- Instructor can create, edit, and delete a review template
- Placeholder variables (`{{studentName}}`, `{{month}}`) render correctly
  in the review editor when a template is applied
- Instructor with TA assignments sees a weekly check-in prompt; submitting
  it persists records to `ta_checkins`
- All new API routes return 401 for unauthenticated and 403 for wrong-role
  requests
- Backend tests cover all new routes; frontend component tests cover the
  dashboard and review editor

## Scope

### In Scope

- Drizzle schema: add `ta_checkins` table + migration
- API routes: `/api/instructor/dashboard`, `/api/reviews/*`,
  `/api/templates/*`, `/api/checkins/*`
- Frontend pages: real Dashboard, ReviewList, ReviewEditor, TemplateList,
  TemplateEditor, CheckinPage
- Month picker shared component
- Review status workflow (`pending → draft → sent`)
- Template variable substitution preview on client
- `isActiveInstructor` middleware on all new routes
- Server tests for all new routes
- Client component tests for Dashboard and ReviewEditor

### Out of Scope

- Real email delivery (reviews are marked `sent` in DB only)
- Admin panel (Sprint 003)
- Guardian feedback (Sprint 004)
- Pike13 integration (Sprint 005)
- Automated monthly report generation (Sprint 006)
- GitHub activity summaries (Sprint 006)

## Test Strategy

- **Server tests** (`tests/server/`): each new route — happy path, 401
  without session, 403 with wrong role, and key error cases
- **Client tests** (`tests/client/`): Dashboard renders correct counts;
  ReviewEditor submits form and updates status; TemplateEditor saves and
  applies templates
- **Manual smoke**: log in as instructor, open dashboard, draft a review,
  apply a template, submit check-in

## Architecture Notes

- TA/VA users don't yet exist in the database (Pike13 sync is Sprint 005).
  The check-in UI is built and wired to `ta_checkins`, but shows "No TAs
  assigned" until Sprint 005 populates assignments.
- `monthly_reviews` rows are created manually by the instructor in this
  sprint. Automated creation on the 1st of the month is Sprint 006.
- No shared layer — client defines its own response-shape interfaces in
  `client/src/types/`.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [ ] Architecture review passed
- [ ] Stakeholder has approved the sprint plan

## Tickets

(To be created after sprint approval.)
