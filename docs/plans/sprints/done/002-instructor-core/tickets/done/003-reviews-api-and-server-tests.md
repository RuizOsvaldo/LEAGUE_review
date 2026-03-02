---
id: '003'
title: Reviews API and server tests
status: done
use-cases:
- SUC-002
- SUC-003
- SUC-006
depends-on:
- '001'
---

# Reviews API and server tests

## Description

Create `server/src/routes/reviews.ts` with full CRUD for monthly reviews.
All routes are protected by `isActiveInstructor`. Register in `server/src/index.ts`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reviews` | List reviews for instructor; `?month=YYYY-MM` filter |
| POST | `/api/reviews` | Create a `pending` review for a student + month |
| GET | `/api/reviews/:id` | Get a single review |
| PUT | `/api/reviews/:id` | Update subject/body (only when `status != sent`) |
| POST | `/api/reviews/:id/send` | Advance status to `sent`, set `sentAt` |

**Business rules**:
- PUT returns 409 if `status === 'sent'`
- POST `/send` is idempotent if already sent
- Instructor may only access their own reviews (filter by session `instructorId`)

**Response shape** (`ReviewDto`):
```ts
{
  id: number
  studentId: number
  studentName: string
  month: string
  status: 'pending' | 'draft' | 'sent'
  subject: string | null
  body: string | null
  sentAt: string | null
  createdAt: string
  updatedAt: string
}
```

## Acceptance Criteria

- [ ] `GET /api/reviews` lists only the authenticated instructor's reviews for the given month
- [ ] `POST /api/reviews` creates a `pending` review
- [ ] `PUT /api/reviews/:id` updates subject/body and changes status to `draft`
- [ ] `PUT /api/reviews/:id` returns 409 when status is `sent`
- [ ] `POST /api/reviews/:id/send` sets `status = 'sent'` and records `sentAt`
- [ ] `POST /api/reviews/:id/send` is idempotent (repeated calls return 200)
- [ ] All routes return 401/403 for unauthenticated or wrong-role requests
- [ ] Instructor cannot access another instructor's reviews (returns 404)

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/reviews.test.ts`
  - Happy path for each route
  - 409 on PUT after send
  - Idempotent send
  - 401 and 403 guards
  - Cross-instructor isolation (404 on another instructor's review)
- **Verification command**: `npm run test:server`
