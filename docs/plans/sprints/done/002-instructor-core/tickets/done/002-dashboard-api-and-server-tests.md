---
id: '002'
title: Dashboard API and server tests
status: done
use-cases:
- SUC-001
- SUC-006
depends-on:
- '001'
---

# Dashboard API and server tests

## Description

Create `server/src/routes/instructor.ts` with `GET /api/instructor/dashboard`.
Route is protected by the existing `isActiveInstructor` middleware.

**Query parameter**: `?month=YYYY-MM` (defaults to current month if omitted).

**Response shape**:
```ts
{
  month: string           // "YYYY-MM"
  totalStudents: number   // students assigned to this instructor
  pending: number
  draft: number
  sent: number
}
```

Counts are Drizzle grouped queries on `monthly_reviews` filtered by
`instructorId` (from `req.session.instructorId`) and `month`. `totalStudents`
counts `instructor_students` rows for this instructor.

Register the router in `server/src/index.ts`.

## Acceptance Criteria

- [ ] Returns correct `pending`, `draft`, `sent` counts for the requested month
- [ ] Defaults to current month when `?month` is absent
- [ ] Returns 401 for unauthenticated requests
- [ ] Returns 403 for requests with `role !== 'instructor'` or inactive instructor
- [ ] `totalStudents` reflects the instructor's assigned students (0 if none)

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/instructor-dashboard.test.ts`
  - Happy path: returns correct counts for a seeded month
  - Default month: omit `?month`, verify current month is used
  - 401: no session cookie
  - 403: session with `role = 'admin'`
  - 403: inactive instructor
- **Verification command**: `npm run test:server`
