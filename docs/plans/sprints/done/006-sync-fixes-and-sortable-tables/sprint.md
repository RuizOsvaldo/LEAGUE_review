---
id: '006'
title: Sync Fixes and Sortable Tables
status: done
branch: sprint/006-sync-fixes-and-sortable-tables
use-cases:
- UC-001: TA/student dual-role sync
- UC-002: GitHub username field matching
- UC-003: Sortable table columns
---

# Sprint 006: Sync Fixes and Sortable Tables

## Goals

Fix two Pike13 sync bugs that caused TAs who also attend classes as students
to disappear from instructor rosters and GitHub usernames to never populate.
Add consistent sortable column headers across all data tables in the app.

## Problem

1. Students who are also TAs (e.g. "TA-Drake") were filtered out of the
   students table during Pike13 sync because the sync assumed TA-prefixed
   names could never be students. They appeared in neither the instructor's
   student list nor as TAs.
2. GitHub usernames were never populated because the custom field lookup used
   a case-sensitive exact match (`github_acct_name`) while Pike13 stores the
   field as "Git Hub Acct Name".
3. All data tables except the Instructor list lacked sortable column headers,
   making it difficult to scan and compare data.

## Solution

- Remove the TA/VA name filter from the student people sync so all people,
  regardless of name prefix, are upserted into the students table.
- Add on-the-fly student record creation for people who appear as event
  attendees but are absent from the `desk/people` endpoint (staff-only
  accounts who also attend classes).
- Normalise Pike13 custom field names before comparison by stripping all
  non-alphanumeric characters and lowercasing, making the lookup
  format-agnostic.
- Add sort state (key + direction) and `useMemo`-based sorted arrays to
  AdminFeedbackPage, CompliancePage, VolunteerHoursPage (SummaryTable), and
  DashboardPage (My Students table).

## Success Criteria

- TAs who attend classes as students appear in the instructor's student roster
  after the next Pike13 sync.
- GitHub usernames are populated for students who have the field set in
  Pike13, regardless of how the field name is capitalised.
- All data tables have clickable column headers with ↑/↓ sort indicators
  consistent with the existing Instructor list behaviour.

## Scope

### In Scope

- `server/src/services/pike13Sync.ts` — sync logic fixes
- `client/src/pages/AdminFeedbackPage.tsx` — sortable columns
- `client/src/pages/CompliancePage.tsx` — sortable columns
- `client/src/pages/VolunteerHoursPage.tsx` — sortable summary table
- `client/src/pages/DashboardPage.tsx` — sortable student table

### Out of Scope

- Backfilling historical sync data (next sync will pick up all changes)
- Sorting the detail view card list in VolunteerHoursPage (not a table)
- Sorting ReviewListPage or TemplateListPage (card/link lists, not tables)

## Test Strategy

TypeScript compilation (`tsc --noEmit`) on both client and server confirms
no type errors. Functional testing requires a Pike13 sync run with a
known TA/student dual-role account and verification in the instructor UI.

## Architecture Notes

- The on-the-fly student creation reuses the same `onConflictDoUpdate`
  pattern as the bulk sync, keyed on `pike13SyncId`, so duplicate events
  are idempotent.
- Sort logic is purely client-side (`useMemo`) — no API changes needed.
- Field name normalisation uses a pure function with no external dependencies.

## Definition of Ready

- [x] Sprint planning documents are complete
- [x] Architecture review passed (straightforward bug fixes, no new services)
- [x] Stakeholder approved

## Tickets

- [x] 006-001: Fix TA/student dual-role sync
- [x] 006-002: Fix GitHub username field matching
- [x] 006-003: Add sortable columns to all data tables
