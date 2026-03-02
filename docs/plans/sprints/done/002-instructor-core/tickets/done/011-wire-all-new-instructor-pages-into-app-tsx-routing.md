---
id: '011'
title: Wire all new instructor pages into App.tsx routing
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-004
- SUC-005
- SUC-006
depends-on:
- '007'
- 008
- 009
- '010'
---

# Wire all new instructor pages into App.tsx routing

## Description

Update `client/src/App.tsx` to import and register all new pages under the
existing `ProtectedRoute role="instructor"` wrapper.

Routes to add:

| Route | Component |
|-------|-----------|
| `/dashboard` | `DashboardPage` (replaces stub) |
| `/reviews` | `ReviewListPage` |
| `/reviews/:id` | `ReviewEditorPage` |
| `/templates` | `TemplateListPage` |
| `/templates/new` | `TemplateEditorPage` |
| `/templates/:id` | `TemplateEditorPage` |
| `/checkin` | `CheckinPage` |

The `/dashboard` route should replace (not duplicate) the existing stub route.

Also update the instructor navigation menu (sidebar or nav bar, wherever it
exists in the current layout) to include links to Reviews, Templates, and
Check-in.

## Acceptance Criteria

- [ ] All 7 routes are registered under `ProtectedRoute role="instructor"`
- [ ] Navigating to each route renders the correct page
- [ ] Unauthenticated users are redirected to `/login`
- [ ] Admin-role users are redirected away from instructor routes
- [ ] Instructor nav includes links to Dashboard, Reviews, Templates, Check-in
- [ ] TypeScript compiles without errors

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: none beyond TypeScript compilation check
- **Verification command**: `cd client && npx tsc --noEmit` then manual smoke
