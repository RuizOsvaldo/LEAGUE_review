---
id: 009
title: Template List and Template Editor pages
status: done
use-cases:
- SUC-004
depends-on:
- '004'
- '006'
---

# Template List and Template Editor pages

## Description

Create two new pages in `client/src/pages/`:

**`TemplateListPage.tsx`** (`/templates`):
- Calls `GET /api/templates` to list the instructor's templates
- Each row shows name, truncated subject, and Edit / Delete buttons
- Delete triggers `DELETE /api/templates/:id` with a confirmation dialog
- "New Template" button navigates to `/templates/new`

**`TemplateEditorPage.tsx`** (`/templates/new` and `/templates/:id`):
- Create mode: blank form; on save calls `POST /api/templates`
- Edit mode: pre-populated from `GET /api/templates/:id`... or fetch the
  template from the list cache; on save calls `PUT /api/templates/:id`
- Fields: Name, Subject, Body (textarea)
- Helper text beneath Body noting `{{studentName}}` and `{{month}}`
  as supported placeholders
- Cancel navigates back to `/templates`

## Acceptance Criteria

- [ ] Template list renders all instructor templates
- [ ] Delete removes the template and updates the list
- [ ] New template form creates and redirects to list on save
- [ ] Edit form pre-populates with existing data
- [ ] Saving updated template persists changes
- [ ] Placeholder hint text is visible in the editor
- [ ] Cancel returns to the template list without saving

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: `tests/client/TemplateEditorPage.test.tsx`
  - Create mode: submits POST with form values
  - Edit mode: renders pre-populated fields, submits PUT on save
  - Delete: fires DELETE and removes item from list
- **Verification command**: `npm run test:client`
