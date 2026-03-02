---
id: '006'
title: Client TypeScript types for reviews, templates, and check-ins
status: done
use-cases:
- SUC-002
- SUC-003
- SUC-004
- SUC-005
depends-on:
- '003'
- '004'
- '005'
---

# Client TypeScript types for reviews, templates, and check-ins

## Description

Create three type files in `client/src/types/` matching the API response
shapes defined in the backend tickets. These types are consumed by all
frontend pages and are the single source of truth for API response shapes
on the client side.

**`client/src/types/review.ts`**:
```ts
export type ReviewStatus = 'pending' | 'draft' | 'sent'

export interface ReviewDto {
  id: number
  studentId: number
  studentName: string
  month: string
  status: ReviewStatus
  subject: string | null
  body: string | null
  sentAt: string | null
  createdAt: string
  updatedAt: string
}
```

**`client/src/types/template.ts`**:
```ts
export interface TemplateDto {
  id: number
  name: string
  subject: string
  body: string
  createdAt: string
  updatedAt: string
}
```

**`client/src/types/checkin.ts`**:
```ts
export interface CheckinEntry {
  taName: string
  wasPresent?: boolean
}

export interface PendingCheckinResponse {
  weekOf: string
  alreadySubmitted: boolean
  entries: CheckinEntry[]
}
```

## Acceptance Criteria

- [ ] `client/src/types/review.ts` exports `ReviewDto` and `ReviewStatus`
- [ ] `client/src/types/template.ts` exports `TemplateDto`
- [ ] `client/src/types/checkin.ts` exports `CheckinEntry` and `PendingCheckinResponse`
- [ ] TypeScript compiles without errors: `npm run build` in `client/`

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: none — type-only files; verified by TypeScript compilation
- **Verification command**: `cd client && npx tsc --noEmit`
