---
id: "003"
title: Add sortable columns to all data tables
status: done
use-cases: []
depends-on: []
---

# Add sortable columns to all data tables

## Description

The Instructor list already had sortable column headers (click to sort asc,
click again for desc, with ↑/↓ indicators). No other data table in the app
had this behaviour. Four additional tables needed the same treatment.

## Acceptance Criteria

- [x] AdminFeedbackPage — Student, Instructor, Month, Rating, Submitted columns are sortable (default: newest first)
- [x] CompliancePage — Instructor, Pending, Draft, Sent, Check-in columns are sortable
- [x] VolunteerHoursPage SummaryTable — Volunteer, YTD Hours, Scheduled columns are sortable (default: most hours first)
- [x] DashboardPage My Students table — Name, GitHub columns are sortable
- [x] Sort indicators match the existing InstructorListPage style (↕ grey on inactive, ↑/↓ blue on active)
- [x] Sort is client-side only — no API changes

## Implementation

**Files changed:**
- `client/src/pages/AdminFeedbackPage.tsx` — added `SortIcon`, `useState` for sort state, `useMemo` for sorted rows; also upgraded bare `<table>` to styled card with proper classes
- `client/src/pages/CompliancePage.tsx` — same pattern
- `client/src/pages/VolunteerHoursPage.tsx` — sort state added inside `SummaryTable` component; added `useMemo` import
- `client/src/pages/DashboardPage.tsx` — sort state at page level for the My Students table; added `useMemo` import

## Testing

- **Verification:** `cd /workspaces/LEAGUE_review/client && npx tsc --noEmit` — passes
- **Functional:** Click each column header in each table and verify rows reorder; click again to reverse
