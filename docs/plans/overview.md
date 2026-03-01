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
| Containerisation | Docker Compose (dev), Docker Swarm (prod) |
| Secrets | SOPS + age at rest; Docker Swarm secrets at runtime |
| Reverse proxy | Caddy |

All API routes are prefixed with `/api`. PostgreSQL is the single data store.

## Sprint Roadmap

| Sprint | Title | Focus |
|--------|-------|-------|
| **001** | Foundation | Shared layer setup, DB schema + migrations, auth (signup/login/logout/Google OAuth), role middleware, dev infrastructure |
| **002** | Instructor Core | Instructor dashboard, review editor, template CRUD, month picker, review status workflow |
| **003** | Admin Panel | Admin overview, instructor list (activate/deactivate), compliance dashboard, admin guard middleware |
| **004** | Guardian Feedback | Public feedback page, star-rating submission, feedback read route for admins |
| **005** | Pike13 Stub | OAuth token storage, stub sync endpoint, instructor Pike13 settings page |

## Out of Scope

- Real Pike13 student-assignment sync (stubbed only in v1)
- Email delivery (reviews are "sent" in the database; actual SMTP deferred)
- Mobile native apps (web only)
- Multi-language support
- Parent/guardian accounts (guardians only access the public feedback page)
- FERPA compliance infrastructure
