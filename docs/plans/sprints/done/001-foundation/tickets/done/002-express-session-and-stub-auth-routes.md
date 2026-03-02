---
id: '002'
title: Express session and stub auth routes
status: done
use-cases:
- SUC-001
- SUC-002
depends-on:
- '001'
---

# Express session and stub auth routes

## Description

Wire up `express-session` with `connect-pg-simple` storage (using the
`sessions` table from ticket 001), then implement three stub auth routes that
let developers switch roles without real credentials.

## Acceptance Criteria

- [ ] `express-session` and `connect-pg-simple` added to `server/package.json`
- [ ] Session middleware registered in `server/src/index.ts` with `SESSION_SECRET` env var and `connect-pg-simple` store
- [ ] `POST /api/auth/login` accepts `{ role: "admin" | "instructor" | "inactive" }`, sets `req.session.user`, returns user as JSON
- [ ] `POST /api/auth/logout` destroys the session and returns `{ ok: true }`
- [ ] `GET /api/auth/me` returns `req.session.user` (200) or `{ error: "Unauthenticated" }` (401) if no session
- [ ] Invalid role returns 400 with `{ error: "Invalid role" }`
- [ ] Sessions persist across requests

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/auth.test.ts`
  - POST login with each valid role → 200 + correct user shape
  - POST login with invalid role → 400
  - GET /me without session → 401
  - GET /me after login → 200 + user
  - POST logout → 200; subsequent GET /me → 401
- **Verification command**: `npm run test:server`

## Implementation Notes

Fake user shapes stored in `req.session.user`:
- `admin`: `{ id: 0, name: "Test Admin", email: "admin@test.local", isAdmin: true, isActiveInstructor: false }`
- `instructor`: `{ id: 1, name: "Test Instructor", email: "instructor@test.local", isAdmin: false, isActiveInstructor: true, instructorId: 1 }`
- `inactive`: `{ id: 2, name: "Pending User", email: "pending@test.local", isAdmin: false, isActiveInstructor: false }`

Augment `express-session` types so `req.session.user` is typed via declaration merge in `server/src/types/session.d.ts`. Add `SESSION_SECRET` to `secrets/dev.env`.
