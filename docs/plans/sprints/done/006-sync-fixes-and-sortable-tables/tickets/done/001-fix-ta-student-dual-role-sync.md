---
id: "001"
title: Fix TA/student dual-role sync
status: done
use-cases: []
depends-on: []
---

# Fix TA/student dual-role sync

## Description

People in Pike13 whose names begin with "TA-" or "VA-" were filtered out of
the students table during sync. Anyone who serves as a TA in some classes but
attends as a student in others (e.g. "TA-Drake") appeared in neither the
instructor's student roster nor the volunteer hours list.

Additionally, some TAs only exist in Pike13 as staff members and never appear
in the `desk/people` endpoint. Even after removing the name filter, their
person IDs would be absent from `pike13IdToStudentId` and silently skipped
when processing event attendance.

## Acceptance Criteria

- [x] All people from `desk/people` (including TA/VA-prefixed names) are upserted into the students table
- [x] When a person appears as a confirmed event attendee but has no student record yet, one is created on-the-fly using their Pike13 ID and name
- [x] Existing TA volunteer hours tracking is unaffected
- [x] No duplicate student records (idempotent on `pike13SyncId`)

## Implementation

**File:** `server/src/services/pike13Sync.ts`

- Removed `!isTaOrVa(p.name)` filter from `studentPeople` (step 9)
- Removed `isTaOrVa(person.name)` skip in the event attendee loop (step 10)
- Added on-the-fly `INSERT ... ON CONFLICT DO UPDATE` when a confirmed attendee's person ID is not yet in `pike13IdToStudentId`

## Testing

- **Verification:** `cd /workspaces/LEAGUE_review/server && npx tsc --noEmit` — passes
- **Functional:** Requires Pike13 sync run with a known dual-role account
