---
id: "002"
title: Fix GitHub username field matching
status: done
use-cases: []
depends-on: []
---

# Fix GitHub username field matching

## Description

GitHub usernames were never populating for students because the Pike13 custom
field lookup used a strict exact match (`github_acct_name`) while the actual
field name in Pike13 is "Git Hub Acct Name" (spaces, mixed case). This caused
every student's `githubUsername` to remain null after sync.

## Acceptance Criteria

- [x] GitHub usernames are populated for any student who has the field set in Pike13
- [x] Field name matching is insensitive to capitalisation, spaces, underscores, and hyphens
- [x] The constant `PIKE13_GITHUB_FIELD_KEY` remains as the canonical reference value

## Implementation

**File:** `server/src/services/pike13Sync.ts`

- Added `normalizeFieldName(s)` — strips all non-alphanumeric chars and lowercases
- Added `GITHUB_FIELD_NORMALIZED` constant (pre-computed normalised form)
- Changed the `custom_fields.find()` call to compare normalised names:
  `normalizeFieldName(f.name) === GITHUB_FIELD_NORMALIZED`
- "Git Hub Acct Name" → `"githubacctname"` === `"github_acct_name"` → `"githubacctname"` ✓

## Testing

- **Verification:** `cd /workspaces/LEAGUE_review/server && npx tsc --noEmit` — passes
- **Functional:** Requires Pike13 sync run; check that `github_username` is non-null for students with the field set
