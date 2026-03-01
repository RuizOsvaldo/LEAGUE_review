---
id: '001'
title: Replace Prisma with Drizzle ORM and create full schema
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
depends-on: []
---

# Replace Prisma with Drizzle ORM and create full schema

## Description

The template ships with Prisma. LEAGUE Report uses Drizzle ORM. This ticket
removes Prisma and installs Drizzle, then defines the full LEAGUE database
schema in `server/src/db/schema.ts` and generates + applies the initial
migration.

## Acceptance Criteria

- [ ] `@prisma/client` and `prisma` removed from `server/package.json`; `server/prisma/` directory deleted
- [ ] `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg` added to `server/package.json`
- [ ] `server/src/db/index.ts` exports a Drizzle client connected via `DATABASE_URL`
- [ ] `server/src/db/schema.ts` defines all 10 tables: `users`, `sessions`, `instructors`, `students`, `instructor_students`, `monthly_reviews`, `review_templates`, `service_feedback`, `admin_settings`, `pike13_tokens`
- [ ] `server/drizzle.config.ts` is present and points migrations to `server/drizzle/`
- [ ] Running `npm run db:generate` produces SQL migration files in `server/drizzle/`
- [ ] Running `npm run db:migrate` applies migrations to the database without error
- [ ] `npm run dev` still starts without errors (server uses Drizzle client, not Prisma)

## Testing

- **Existing tests to run**: `npm run test:server` (health route should still pass)
- **New tests to write**: `tests/db/schema.test.ts` — insert a row into each table and verify it round-trips
- **Verification command**: `npm run test:db`

## Implementation Notes

- Use `pgTable` from `drizzle-orm/pg-core`
- `review_status` as a `pgEnum('review_status', ['pending', 'draft', 'sent'])`
- `sessions` table uses the schema required by `connect-pg-simple`: `sid text PRIMARY KEY`, `sess json NOT NULL`, `expire timestamp NOT NULL`
- Add `db:generate` and `db:migrate` scripts to `server/package.json`
- The Drizzle client in `db/index.ts` should use the `pg` Pool, not a single client, for connection reuse
