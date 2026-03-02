---
id: '003'
title: Role middleware
status: done
use-cases:
- SUC-003
depends-on:
- '002'
---

# Role middleware

## Description

Add three Express middleware functions that guard routes based on the session
user's role. These will be used by all protected routes in subsequent sprints.

## Acceptance Criteria

- [ ] `server/src/middleware/auth.ts` exports `isAuthenticated`, `isAdmin`, `isActiveInstructor`
- [ ] `isAuthenticated`: returns 401 `{ error: "Unauthenticated" }` if `req.session.user` is absent
- [ ] `isAdmin`: returns 403 `{ error: "Forbidden" }` if user is not admin (calls `isAuthenticated` first)
- [ ] `isActiveInstructor`: returns 403 `{ error: "Forbidden" }` if user is not an active instructor (calls `isAuthenticated` first)
- [ ] A test route `GET /api/protected/instructor` guarded by `isActiveInstructor` returns 200 for instructor sessions and 401/403 otherwise
- [ ] A test route `GET /api/protected/admin` guarded by `isAdmin` returns 200 for admin sessions and 401/403 otherwise

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/middleware.test.ts`
  - No session → `isAuthenticated` → 401
  - Admin session → `isAuthenticated` → passes; `isAdmin` → passes; `isActiveInstructor` → 403
  - Instructor session → `isActiveInstructor` → passes; `isAdmin` → 403
  - Inactive session → both `isAdmin` and `isActiveInstructor` → 403
- **Verification command**: `npm run test:server`

## Implementation Notes

- Middleware composes: `isAdmin` and `isActiveInstructor` each call `isAuthenticated` internally so routes only need one guard
- Test routes can live in a `server/src/routes/protected.ts` that is only registered in test/dev mode, or inline in the test file using Supertest
