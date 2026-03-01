---
id: "001"
title: Foundation
status: planning
branch: sprint/001-foundation
use-cases: [SUC-001, SUC-002, SUC-003]
---

# Sprint 001: Foundation

## Goals

Establish the full-stack skeleton for LEAGUE Report: database schema with
Drizzle ORM, a stub login for testing, role-based routing stubs, and a working
dev environment. The result is a running app where a developer can log in as
a test user and be routed to role-appropriate placeholder pages.

## Problem

The template codebase ships with Prisma and a minimal counter example. LEAGUE
Report requires Drizzle ORM, a proper database schema, and role-based page
routing. Real authentication is deferred; a direct test login is sufficient for
now.

## Solution

1. **Database** — Replace Prisma with Drizzle ORM; write the full LEAGUE
   schema (`users`, `instructors`, `students`, `instructor_students`,
   `monthly_reviews`, `review_templates`, `service_feedback`, `admin_settings`,
   `pike13_tokens`); run migrations via drizzle-kit. Types and schema stay in
   `server/src/`.

2. **Stub auth** — A simple POST `/api/auth/login` that accepts
   `{ role: "admin" | "instructor" | "inactive" }` and sets a session cookie
   with the corresponding test user. No passwords, no OAuth. A
   `POST /api/auth/logout` destroys the session. `GET /api/auth/me` returns
   current user.

3. **Role middleware** — `isAuthenticated`, `isAdmin`,
   `isActiveInstructor` middleware that read from the session.

4. **Frontend shell** — Install Wouter, shadcn/ui, Tailwind, TanStack React
   Query; create Login stub, PendingActivation, AppHome, Admin stub, and
   Instructor Dashboard stub pages; wire client-side routing; proxy `/api` to
   server.

5. **Dev infra** — Update Dockerfiles and `docker-compose.yml` for the new
   stack; ensure `npm run dev` works end-to-end.

## Success Criteria

- `npm run dev` starts the full stack without errors
- Developer can POST `{ role: "admin" }` to `/api/auth/login` and be redirected
  to the Admin stub page
- Developer can POST `{ role: "instructor" }` and be redirected to the
  Instructor Dashboard stub
- Developer can POST `{ role: "inactive" }` and see the PendingActivation page
- `POST /api/auth/logout` destroys the session; `GET /api/auth/me` returns 401
- Drizzle migrations create all tables correctly
- `/api/health` returns 200

## Scope

### In Scope

- Drizzle ORM setup; full schema migration; Prisma removed
- Stub auth routes: `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`
- `isAuthenticated`, `isAdmin`, `isActiveInstructor` middleware
- Frontend: Wouter routing, shadcn/ui + Tailwind, TanStack Query,
  Login stub, PendingActivation, AppHome, Admin stub, Instructor stub pages
- Docker Compose dev environment working

### Out of Scope

- Real auth (passwords, OAuth, bcrypt) — deferred
- Shared/ cross-package layer — types live in `server/src/` only
- Instructor dashboard (Sprint 002)
- Admin panel (Sprint 003)
- Guardian feedback (Sprint 004)
- Pike13 integration (Sprint 005)

## Test Strategy

- **Server integration tests** (`tests/server/`): stub login sets correct
  session role; `/api/auth/me` returns correct user; middleware blocks
  unauthenticated requests
- **Database tests** (`tests/db/`): schema constraints, basic insert/query per
  table
- **Frontend smoke tests** (`tests/client/`): route guard redirects
  unauthenticated users to `/login`

## Architecture Notes

- Drizzle migrations live in `server/drizzle/`; applied on server start in
  development.
- Session storage: `connect-pg-simple` writing to the `sessions` table.
  Session secret from `SESSION_SECRET` env var.
- Stub login does NOT look up a real user; it synthesises a fake `req.user`
  object from the requested role. This makes switching roles trivial during
  development.
- Types from `server/src/db/schema.ts` are used server-side only. The client
  defines its own lightweight response types matching the shapes returned by
  the API.
- No `shared/` directory.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [ ] Architecture review passed
- [ ] Stakeholder has approved the sprint plan

## Tickets

(To be created after sprint approval.)
