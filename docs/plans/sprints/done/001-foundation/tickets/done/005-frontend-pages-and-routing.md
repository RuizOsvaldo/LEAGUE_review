---
id: '005'
title: Frontend pages and routing
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
depends-on:
- '003'
- '004'
---

# Frontend pages and routing

## Description

Build the client-side routing structure and all page stubs for Sprint 001.
Includes the `useAuth` hook, a `ProtectedRoute` guard component, the Login
page (role picker), PendingActivation page, and stub pages for Dashboard and
Admin.

## Acceptance Criteria

- [ ] `client/src/types/auth.ts` defines `AuthUser` type matching the shape from `GET /api/auth/me`
- [ ] `client/src/hooks/useAuth.ts` exports `useAuth()` — queries `/api/auth/me`, returns `{ user, isLoading }`
- [ ] `client/src/components/ProtectedRoute.tsx` redirects unauthenticated users to `/login`; redirects wrong-role users to their correct page
- [ ] `/login` — `LoginPage`: radio group (Admin / Instructor / Inactive), Login button; on submit POSTs to `/api/auth/login` and redirects per role
- [ ] `/pending-activation` — `PendingActivationPage`: static message + Logout link
- [ ] `/dashboard` — `InstructorDashboardStub`: requires active instructor; shows "Dashboard — coming in Sprint 002"
- [ ] `/admin` — `AdminStub`: requires admin; shows "Admin — coming in Sprint 003"
- [ ] `/*` — `NotFoundPage`: 404 message
- [ ] Navigating to `/dashboard` without a session redirects to `/login`
- [ ] Navigating to `/admin` as an instructor redirects to `/dashboard`

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: `tests/client/routing.test.tsx`
  - Unauthenticated access to `/dashboard` renders redirect to `/login`
  - Authenticated instructor access to `/dashboard` renders the stub
  - Authenticated admin access to `/admin` renders the stub
- **Verification command**: `npm run test:client`

## Implementation Notes

- Use Wouter's `<Switch>` and `<Route>` for routing; `<Redirect>` for programmatic navigation
- `useAuth` uses TanStack Query with `staleTime: Infinity` to avoid re-fetching the session on every render
- The Login page uses `react-hook-form` with a Zod schema `{ role: z.enum(["admin","instructor","inactive"]) }`
- After login, use Wouter's `useLocation` setter to push the correct route
