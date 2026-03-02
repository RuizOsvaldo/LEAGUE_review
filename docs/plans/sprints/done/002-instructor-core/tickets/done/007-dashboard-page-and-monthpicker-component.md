---
id: '007'
title: Dashboard page and MonthPicker component
status: done
use-cases:
- SUC-001
- SUC-006
depends-on:
- '002'
- '006'
---

# Dashboard page and MonthPicker component

## Description

Replace the stub `DashboardPage` with a real implementation that calls
`GET /api/instructor/dashboard?month=YYYY-MM` and displays the response.
Also create a reusable `MonthPicker` component used here and on the Review
List page.

**`client/src/components/MonthPicker.tsx`** — controlled `<select>` using
shadcn/ui Select showing the last 12 months. Reads and writes `?month` in
the URL query string via Wouter's `useSearch` / `useLocation`. Defaults to
the current calendar month.

**`client/src/pages/DashboardPage.tsx`** — replaces the existing stub:
- Renders `MonthPicker` at the top
- Calls the dashboard API for the selected month
- Shows stat cards: Total Students, Pending, Draft, Sent
- Includes a dismissible weekly TA check-in banner when `alreadySubmitted`
  is `false` (fetched from `GET /api/checkins/pending`). Banner links to
  `/checkin`.

## Acceptance Criteria

- [ ] Dashboard shows correct counts from the API for the selected month
- [ ] MonthPicker defaults to the current month
- [ ] Changing the month updates the displayed data without full page reload
- [ ] Selected month is reflected in the URL (`?month=YYYY-MM`)
- [ ] TA check-in banner appears when `alreadySubmitted` is false
- [ ] Banner is dismissible (local state; reappears on refresh if still unsubmitted)
- [ ] Banner does not appear when `alreadySubmitted` is true

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: `tests/client/DashboardPage.test.tsx`
  - Renders stat cards with mocked API data
  - MonthPicker changes trigger a new API call
  - Check-in banner visible when `alreadySubmitted: false`
  - Check-in banner hidden when `alreadySubmitted: true`
- **Verification command**: `npm run test:client`
