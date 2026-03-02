---
status: draft
---

# Project Overview

## Project Name

LEAGUE Report

## Problem Statement

Martial arts and activity-based studios need a structured way for instructors
to communicate monthly student progress to guardians. Today this happens
inconsistently — some instructors send emails, others forget, and admins have
no visibility into compliance. Guardians have no easy channel to leave
structured feedback. The result is poor communication, missed progress reports,
and no audit trail.

LEAGUE Report gives instructors a guided workflow to draft and send monthly
progress reviews, gives admins a compliance dashboard to track who has sent
what, and gives guardians a simple public link to rate the service they
received.

## Target Users

- **Instructors** — Write monthly progress reviews for their assigned students;
  use templates to speed up recurring emails; view their own review history.
- **Admins** — Activate/deactivate instructor accounts; view compliance
  dashboards showing which instructors have sent reviews for the current month.
- **Guardians** — Access a public (unauthenticated) link to leave a star-rating
  service feedback for a student.

## Key Constraints

- **Technology:** Uses the existing docker-node-template stack (Express +
  React + TypeScript + PostgreSQL + Docker Swarm) with **Drizzle ORM** instead
  of Prisma, and **Wouter** + **shadcn/ui** + **TanStack React Query** on the
  frontend.
- **No shared layer:** All schema and types live in `server/src/`; the client
  defines lightweight response-shape interfaces locally.
- **Auth:** Stub role-based login for Sprint 001 (no real credentials); real
  auth (Passport.js + Google OAuth) deferred to a later sprint.
- **Pike13:** External student management system; integration is stubbed in v1
  (OAuth tokens stored per instructor; full sync deferred).
- **Team:** AI-assisted development (CLASI process).

## High-Level Requirements

1. **Authentication**
   - Sprint 001: stub login (pick a role) for development/testing
   - Future: email/password + Google OAuth via Passport.js
   - Admin status determined by `admin_settings` table (email whitelist)
   - Instructors require admin activation before accessing the app
   - Role-based access: Instructor routes, Admin routes, Public (guardian) routes

2. **Instructor workflow**
   - Dashboard: monthly summary (students assigned, reviews drafted/sent/pending)
   - Review editor: draft and send monthly progress email per student
   - Template management: create/edit/delete reusable email templates with
     placeholder variables
   - Month picker: all review views filterable by month

3. **Admin panel**
   - Instructor list: activate/deactivate, view assignment counts
   - Compliance view: per-month table showing each instructor's review counts

4. **Guardian feedback**
   - Public page (no auth) at a stable URL per student/review
   - Star rating + optional comment submitted as `service_feedback` record

5. **Pike13 integration stub**
   - Store OAuth tokens per instructor in `pike13_tokens` table
   - Stub endpoint for triggering a student-assignment sync
   - Full sync implementation deferred to a future sprint

6. **Server-side schema**
   - `server/src/db/schema.ts` — Drizzle table defs and derived TS types
   - Client defines lightweight response-shape interfaces locally

7. **Instructor filtering (TA/VA exclusion)**
   - When pulling instructors from Pike13 classes, skip any whose name
     begins with `TA ` or `VA ` (e.g. "TA John Smith", "VA Jane Doe")
   - Only instructors whose accounts were explicitly created by an admin
     receive auto-generated monthly reports
   - This ensures volunteer and assistant roles do not pollute the report
     workflow

8. **Automated monthly report generation**
   - On the 1st of each month, automatically create a `pending` review
     record for every (active instructor, assigned student) pair
   - Automation is scoped only to admin-activated instructor accounts
     (TA/VA accounts are excluded per requirement 7)
   - Implemented as a PostgreSQL-scheduled job triggered by a cron
     endpoint or `pg_cron`; no external scheduler required

9. **GitHub activity summaries**
   - When drafting a progress review for a student in a class whose title
     contains `Java` or `Python` (e.g. "Python@CV Cobra"), fetch that
     student's GitHub push events from the past 30 days via the
     **GitHub MCP server** and generate a plain-language summary of what
     they accomplished
   - The student's GitHub username is stored as a custom field on their
     Pike13 client profile and synced during the Pike13 student-assignment
     sync
   - Summary is pre-populated into the review draft; the instructor can
     edit it before sending
   - Classes without `Java` or `Python` in the title receive no GitHub
     summary (the field is simply absent from the draft)

10. **Manager reporting — staff ratio alerts**
    - After each Pike13 sync, compute the active student count per
      instructor; instructors who teach two classes simultaneously are
      counted once (deduplicated by instructor ID, not class)
    - **Warning:** instructor has 5–6 active students → send admin a
      warning notification
    - **Flag:** instructor has more than 6 active students → send admin an
      urgent alert recommending an additional assistant be added
    - Alerts surface in the admin compliance dashboard and optionally via
      email; the 6:1 ratio is configurable in `admin_settings`

11. **Volunteer hours tracking**
    - Admin panel section for recording and reporting volunteer hours
    - **Teaching hours:** automatically sourced from Pike13 class data —
      any session where a TA/VA was present counts as a teaching volunteer
      hour; populated during the Pike13 sync
    - **Other categories:** manually entered by admin; initial supported
      categories include `Fundraising`, `Events`, `Admin Support`, and a
      free-text `Other` field; category list is admin-configurable
    - Reporting view: filterable by volunteer (instructor/TA), category,
      and date range; exportable summary (CSV)
    - Schema: `volunteer_hours` table with columns `id`, `userId`,
      `category`, `hours`, `description`, `recordedAt`, `source`
      (`pike13` | `manual`)

12. **Weekly TA attendance check-in**
    - Every week (configurable day, default Monday), each active instructor
      receives an in-app prompt listing the TAs/VAs assigned to their
      class(es) for the prior week
    - Instructor confirms each TA as **Present** or **Absent** for that
      week; confirmation is stored and drives accurate Pike13 attendance
      recording
    - If a TA is marked Absent, the volunteer teaching hour for that
      session is not credited (requirement 11)
    - Admin can see check-in completion status per instructor in the
      compliance dashboard; overdue (unsubmitted) check-ins are flagged
    - Schema: `ta_checkins` table with columns `id`, `instructorId`,
      `taUserId`, `weekOf` (ISO date of Monday), `wasPresent` (boolean),
      `submittedAt`

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Express 4 + TypeScript (Node.js 20 LTS) |
| Frontend SPA | Vite + React 18 + TypeScript |
| Routing (client) | Wouter |
| UI | shadcn/ui + Tailwind CSS |
| Server state | TanStack React Query |
| Forms | react-hook-form + Zod |
| Database | PostgreSQL 16 Alpine |
| ORM / Migrations | Drizzle ORM + drizzle-kit |
| Auth | Passport.js (Local + Google OAuth) + connect-pg-simple |
| GitHub integration | GitHub MCP server (push event summaries for Java/Python classes) |
| Containerisation | Docker Compose (dev), Docker Swarm (prod) |
| Secrets | SOPS + age at rest; Docker Swarm secrets at runtime |
| Reverse proxy | Caddy |

All API routes are prefixed with `/api`. PostgreSQL is the single data store.

## Sprint Roadmap

| Sprint | Title | Focus |
|--------|-------|-------|
| **001** | Foundation | Shared layer setup, DB schema + migrations, auth (signup/login/logout/Google OAuth), role middleware, dev infrastructure |
| **002** | Instructor Core | Instructor dashboard, review editor, template CRUD, month picker, review status workflow, weekly TA attendance check-in prompt and submission |
| **003** | Admin Panel | Admin overview, instructor list (activate/deactivate), compliance dashboard, staff ratio alerts (6:1 warning/flag), volunteer hours tracking (manual entry + reporting), check-in completion visibility |
| **004** | Guardian Feedback | Public feedback page, star-rating submission, feedback read route for admins |
| **005** | Pike13 Integration | Full OAuth flow, real student-assignment sync, TA/VA instructor filtering, GitHub username sync, teaching volunteer hours auto-populated from Pike13 session data |
| **006** | Automated Reports & GitHub Summaries | Monthly auto-generation of review records on the 1st, GitHub MCP integration for Java/Python class push summaries pre-populated into drafts |

## Out of Scope

- Email delivery (reviews are "sent" in the database; actual SMTP deferred)
- Mobile native apps (web only)
- Multi-language support
- Parent/guardian accounts (guardians only access the public feedback page)
- FERPA compliance infrastructure
- GitHub repository content or code analysis beyond push event summaries
- AI-generated code quality feedback (GitHub summaries are activity summaries only)
- Automated Pike13 attendance write-back (TA check-in results inform LEAGUE Report records; pushing corrections back to Pike13 is out of scope)
- Payroll or stipend calculation from volunteer hours (hours are tracked for reporting only)
