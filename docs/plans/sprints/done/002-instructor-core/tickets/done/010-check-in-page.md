---
id: '010'
title: Check-in page
status: done
use-cases:
- SUC-005
depends-on:
- '005'
- '006'
---

# Check-in page

## Description

Create `client/src/pages/CheckinPage.tsx` (`/checkin`) for the weekly TA
attendance check-in flow.

**Page behaviour**:
1. On load, calls `GET /api/checkins/pending`
2. If `alreadySubmitted: true`, shows a success banner ("Check-in already
   submitted for this week") and a Back to Dashboard link
3. If `entries: []`, shows "No TAs assigned this week" with a Back link
4. Otherwise, renders a list of TA names with Present / Absent radio buttons
5. A "Notify Admin" button (per TA row) calls
   `POST /api/checkins/notify-admin` with a pre-filled message:
   `"TA {taName} was present but has no system profile. Please create one."`
   This button is only shown when no entries exist (i.e., the TA appeared
   but isn't in the system — handled by a free-text "Add unlisted TA" flow
   described below)
6. An **Add unlisted TA** text field at the bottom lets the instructor type
   a name and add a row to the local form
7. **Submit** calls `POST /api/checkins` with the week's entries; on success
   navigates back to `/dashboard`

## Acceptance Criteria

- [ ] Page shows "already submitted" state when `alreadySubmitted: true`
- [ ] Page shows "No TAs assigned" when entries are empty and no unlisted TAs added
- [ ] Each TA entry has Present / Absent radio buttons
- [ ] Instructor can add an unlisted TA by name
- [ ] "Notify Admin" sends the notify-admin request and shows a confirmation toast
- [ ] Submit posts all entries and redirects to dashboard
- [ ] Submitting a second time for the same week is handled gracefully (idempotent)

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: none required beyond manual smoke test (per sprint
  test strategy); the API layer is covered by ticket 005 server tests
- **Verification command**: manual smoke — log in as instructor, navigate to `/checkin`
