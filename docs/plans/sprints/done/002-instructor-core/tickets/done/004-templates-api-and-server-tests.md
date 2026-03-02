---
id: '004'
title: Templates API and server tests
status: done
use-cases:
- SUC-004
depends-on:
- '001'
---

# Templates API and server tests

## Description

Create `server/src/routes/templates.ts` with full CRUD for review templates.
All routes are protected by `isActiveInstructor`. Register in `server/src/index.ts`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/templates` | List templates for the authenticated instructor |
| POST | `/api/templates` | Create a new template |
| PUT | `/api/templates/:id` | Update an existing template |
| DELETE | `/api/templates/:id` | Delete a template |

Templates are scoped to the authenticated instructor. `DELETE` and `PUT` return
404 if the template doesn't belong to the requesting instructor.

**Response shape** (`TemplateDto`):
```ts
{
  id: number
  name: string
  subject: string
  body: string
  createdAt: string
  updatedAt: string
}
```

## Acceptance Criteria

- [ ] `GET /api/templates` returns only the instructor's own templates
- [ ] `POST /api/templates` creates a template with name, subject, body
- [ ] `PUT /api/templates/:id` updates the template
- [ ] `DELETE /api/templates/:id` removes the template
- [ ] `PUT` and `DELETE` return 404 for another instructor's template
- [ ] All routes return 401/403 for unauthenticated or wrong-role requests
- [ ] Deleting a template does not affect already-drafted reviews

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/templates.test.ts`
  - Happy path for each route
  - Cross-instructor isolation (404 on another instructor's template)
  - 401 and 403 guards
- **Verification command**: `npm run test:server`
