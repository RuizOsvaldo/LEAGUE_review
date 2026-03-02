---
id: '001'
title: 'Schema additions: ta_checkins, admin_notifications, monthly_reviews unique
  constraint'
status: done
use-cases:
- SUC-005
depends-on: []
---

# Schema additions: ta_checkins, admin_notifications, monthly_reviews unique constraint

## Description

Add two new tables to `server/src/db/schema.ts` and add a missing unique
constraint to `monthly_reviews`. Run `npm run db:generate && npm run db:migrate`
to produce and apply the migration.

**`ta_checkins`** — records weekly instructor confirmation that each TA/VA
attended. Uses `taName text` (not a FK) because TA user accounts don't exist
until Sprint 005.

```ts
export const taCheckins = pgTable('ta_checkins', {
  id: serial('id').primaryKey(),
  instructorId: integer('instructor_id').notNull().references(() => instructors.id),
  taName: text('ta_name').notNull(),
  weekOf: text('week_of').notNull(),   // ISO date of Monday, e.g. "2026-03-02"
  wasPresent: boolean('was_present').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
}, (t) => [
  unique().on(t.instructorId, t.taName, t.weekOf),
])
```

**`admin_notifications`** — allows instructors to message admins (e.g., "TA
has no profile yet"). Admin reads these in Sprint 003.

```ts
export const adminNotifications = pgTable('admin_notifications', {
  id: serial('id').primaryKey(),
  fromUserId: integer('from_user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
```

**`monthly_reviews` unique constraint** — add `unique().on(t.instructorId, t.studentId, t.month)` using array syntax to the existing table definition.

## Acceptance Criteria

- [ ] `ta_checkins` table exists in the database after migration
- [ ] `ta_checkins` uses `ta_name text` (not a foreign key to `users`)
- [ ] Unique constraint on `(instructor_id, ta_name, week_of)` prevents duplicate check-ins
- [ ] `admin_notifications` table exists in the database after migration
- [ ] `monthly_reviews` has a unique constraint on `(instructor_id, student_id, month)`
- [ ] Drizzle constraints use array syntax (not object syntax)
- [ ] Migration runs cleanly: `npm run db:generate && npm run db:migrate`
- [ ] No existing data is affected (new tables are empty; constraint addition is safe on empty table)

## Testing

- **Existing tests to run**: `npm run test:db` — verify no regression in existing schema tests
- **New tests to write**: `tests/db/sprint002-schema.test.ts` — insert and select rows in both new tables; verify unique constraint rejects duplicates
- **Verification command**: `npm run test:db`
