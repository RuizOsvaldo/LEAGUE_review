---
id: '005'
title: Check-in API and server tests
status: done
use-cases:
- SUC-005
depends-on:
- '001'
---

# Check-in API and server tests

## Description

Create `server/src/routes/checkins.ts` with routes for weekly TA attendance.
All routes are protected by `isActiveInstructor`. Register in `server/src/index.ts`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/checkins/pending` | Returns TAs needing check-in for the current week |
| POST | `/api/checkins` | Submit check-in records for the week |
| POST | `/api/checkins/notify-admin` | Send in-app message to admin |

**GET response**:
```ts
{
  weekOf: string                        // Monday of current week (ISO date)
  alreadySubmitted: boolean
  entries: Array<{ taName: string }>    // empty until Sprint 005
}
```

**POST `/api/checkins` body**:
```ts
{
  weekOf: string
  entries: Array<{ taName: string, wasPresent: boolean }>
}
```

Entries are upserted on `(instructorId, taName, weekOf)`. Submitting
twice for the same week updates existing records (idempotent).

**POST `/api/checkins/notify-admin`** inserts a row into
`admin_notifications` with `fromUserId` from session.

## Acceptance Criteria

- [ ] `GET /api/checkins/pending` returns `entries: []` when no TAs assigned
- [ ] `GET /api/checkins/pending` sets `alreadySubmitted: true` if current week already in `ta_checkins`
- [ ] `POST /api/checkins` upserts records for the given week
- [ ] Submitting twice for the same `weekOf` updates rather than duplicating
- [ ] `POST /api/checkins/notify-admin` inserts into `admin_notifications`
- [ ] All routes return 401/403 for unauthenticated or wrong-role requests

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/checkins.test.ts`
  - GET pending with no TAs returns empty entries
  - POST with entries, verify upsert
  - Idempotent: submit again, row count unchanged
  - `alreadySubmitted: true` after first submission
  - Notify admin: message persisted to `admin_notifications`
  - 401 and 403 guards
- **Verification command**: `npm run test:server`
