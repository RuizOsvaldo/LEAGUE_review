---
id: '012'
title: Client component tests for Dashboard, ReviewEditor, and TemplateEditor
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-004
depends-on:
- '007'
- 008
- 009
- '011'
---

# Client component tests for Dashboard, ReviewEditor, and TemplateEditor

## Description

Write Vitest + React Testing Library tests for the three components specified
in the sprint test strategy. Tests go in `tests/client/`.

**`tests/client/DashboardPage.test.tsx`** (expands ticket 007's stub):
- Renders stat cards with mocked API response (`pending: 2, draft: 1, sent: 3`)
- Changing the MonthPicker triggers a new fetch for the selected month
- Check-in banner visible when mocked `GET /api/checkins/pending` returns
  `alreadySubmitted: false`
- Check-in banner hidden when `alreadySubmitted: true`

**`tests/client/ReviewEditorPage.test.tsx`** (expands ticket 008's stub):
- Draft review renders with editable subject and body fields
- Clicking "Save Draft" fires `PUT /api/reviews/:id` with field values
- After save, status badge updates to "draft"
- Sent review renders subject and body as read-only
- Clicking "Mark as Sent" fires send endpoint; fields become read-only
- "Apply Template" modal lists templates and substitutes placeholders

**`tests/client/TemplateEditorPage.test.tsx`** (expands ticket 009's stub):
- Create mode: empty form; Submit fires `POST /api/templates` with values
- Edit mode: pre-populated fields; Submit fires `PUT /api/templates/:id`
- Cancel navigates back without saving

Use `msw` (Mock Service Worker) or `vi.mock` to intercept fetch calls.
Follow the existing test setup patterns in `tests/client/`.

## Acceptance Criteria

- [ ] All three test files exist in `tests/client/`
- [ ] Each file has at least the test cases listed above
- [ ] `npm run test:client` passes with no failures
- [ ] Tests are deterministic (no reliance on real network calls)

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: see description above
- **Verification command**: `npm run test:client`
