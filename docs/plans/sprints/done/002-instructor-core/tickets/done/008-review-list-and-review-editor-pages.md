---
id: 008
title: Review List and Review Editor pages
status: done
use-cases:
- SUC-002
- SUC-003
- SUC-006
depends-on:
- '003'
- '004'
- '006'
---

# Review List and Review Editor pages

## Description

Create two new pages in `client/src/pages/`:

**`ReviewListPage.tsx`** (`/reviews`):
- Renders `MonthPicker` (from ticket 007) at the top
- Calls `GET /api/reviews?month=YYYY-MM` for the selected month
- Lists all reviews with student name, status badge, and a link to the editor
- If the instructor has students but a review row doesn't exist for this month,
  calls `POST /api/reviews` to auto-create a `pending` row on page load

**`ReviewEditorPage.tsx`** (`/reviews/:id`):
- Loads the review via `GET /api/reviews/:id`
- Shows subject and body text fields (editable when `status !== 'sent'`)
- **Save Draft** button: calls `PUT /api/reviews/:id`, status becomes `draft`
- **Mark as Sent** button: calls `POST /api/reviews/:id/send`; after success,
  fields become read-only
- **Apply Template** button: opens a modal listing the instructor's templates
  (`GET /api/templates`); selecting one runs `applyTemplate()` to substitute
  `{{studentName}}` and `{{month}}` then populates the editor fields
- **Generate from GitHub** placeholder button (disabled, tooltip: "Available in Sprint 6")
- Warns on unsaved navigation (use `window.onbeforeunload` or a Wouter guard)

Template substitution helper (client-side):
```ts
function applyTemplate(template: TemplateDto, studentName: string, month: string): string {
  return template.body
    .replace(/\{\{studentName\}\}/g, studentName)
    .replace(/\{\{month\}\}/g, month)
}
```

## Acceptance Criteria

- [ ] Review List shows all reviews for the selected month with correct status badges
- [ ] Auto-creates pending rows for students missing a review for the selected month
- [ ] Clicking a review opens the editor for that review
- [ ] Save Draft persists subject/body and changes status to `draft`
- [ ] Mark as Sent sets `status = 'sent'` and makes fields read-only
- [ ] Already-sent reviews open in read-only mode
- [ ] Apply Template substitutes `{{studentName}}` and `{{month}}`
- [ ] Unsaved changes trigger a browser warning on navigation
- [ ] "Generate from GitHub" button is visible but disabled

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: `tests/client/ReviewEditorPage.test.tsx`
  - Renders draft review with editable fields
  - Save Draft submits PUT and updates status display
  - Mark as Sent calls send endpoint and renders read-only
  - Sent review opens read-only on load
  - Template apply substitutes placeholders correctly
- **Verification command**: `npm run test:client`
