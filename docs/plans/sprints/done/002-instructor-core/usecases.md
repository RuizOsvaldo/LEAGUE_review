---
status: draft
---

# Sprint 002 Use Cases

## SUC-001: View Instructor Dashboard

- **Actor**: Instructor (active)
- **Preconditions**: Instructor is logged in; at least one student is assigned
- **Main Flow**:
  1. Instructor navigates to `/dashboard`
  2. System displays the current month's review summary: total students
     assigned, count of reviews in `pending`, `draft`, and `sent` states
  3. Instructor selects a different month using the month picker
  4. Dashboard updates to reflect review counts for the selected month
- **Postconditions**: Instructor sees accurate counts for the chosen month
- **Acceptance Criteria**:
  - [ ] Dashboard shows correct counts for pending/draft/sent reviews
  - [ ] Month picker changes the displayed data
  - [ ] Page is inaccessible to unauthenticated users (→ `/login`)
  - [ ] Page is inaccessible to admin-only users (→ redirect)

---

## SUC-002: Draft a Progress Review

- **Actor**: Instructor (active)
- **Preconditions**: Instructor is logged in; student is assigned to instructor
- **Main Flow**:
  1. Instructor opens the review list for the current (or selected) month
  2. Instructor selects a student with a `pending` review
  3. System opens the review editor pre-populated with the student's name
     and the selected month
  4. Instructor types a subject and body
  5. Instructor clicks **Save Draft** — status changes to `draft`
  6. Instructor can return and edit the draft
- **Postconditions**: `monthly_reviews` row has `status = draft` with subject
  and body saved
- **Acceptance Criteria**:
  - [ ] Save Draft persists subject and body; status becomes `draft`
  - [ ] Repeated saves overwrite without creating duplicate rows
  - [ ] Unsaved navigation warns the instructor of unsaved changes

---

## SUC-003: Send a Progress Review

- **Actor**: Instructor (active)
- **Preconditions**: Review exists with `status = draft`
- **Main Flow**:
  1. Instructor opens a draft review in the editor
  2. Instructor reviews the content and clicks **Mark as Sent**
  3. System sets `status = sent` and records `sentAt` timestamp
  4. Review is no longer editable; it displays in read-only mode
- **Postconditions**: `monthly_reviews` row has `status = sent`, `sentAt` set
- **Acceptance Criteria**:
  - [ ] Sent reviews cannot be edited (editor is read-only)
  - [ ] `sentAt` is recorded on transition to sent
  - [ ] Review list reflects the updated status

---

## SUC-004: Manage Review Templates

- **Actor**: Instructor (active)
- **Preconditions**: Instructor is logged in
- **Main Flow**:
  1. Instructor navigates to the Templates page
  2. Instructor creates a new template with a name, subject, and body
     (may include `{{studentName}}` and `{{month}}` placeholders)
  3. Instructor can edit or delete existing templates
  4. In the review editor, instructor clicks **Apply Template**, selects
     a template, and the subject/body fields are populated with placeholders
     replaced by the current student name and month
- **Postconditions**: Templates are saved to `review_templates`; applied
  template content is editable before saving
- **Acceptance Criteria**:
  - [ ] Template CRUD operations persist correctly
  - [ ] `{{studentName}}` and `{{month}}` are substituted on apply
  - [ ] Deleting a template does not affect already-drafted reviews

---

## SUC-005: Submit Weekly TA Check-in

- **Actor**: Instructor (active)
- **Preconditions**: Instructor is logged in; it is the start of the week
- **Main Flow**:
  1. Instructor is shown a weekly check-in prompt listing each TA/VA
     assigned to their class(es) for the prior week
  2. For each TA, instructor selects **Present** or **Absent**
  3. Instructor submits the check-in
  4. System saves a `ta_checkins` record for each TA with `weekOf` set to
     the Monday of the prior week and `wasPresent` flag
- **Postconditions**: `ta_checkins` rows exist for the week; prompt is
  dismissed until next week
- **Acceptance Criteria**:
  - [ ] Check-in cannot be submitted twice for the same week
  - [ ] If no TAs are assigned, page displays "No TAs assigned this week"
  - [ ] Submitted check-ins are visible to admin (Sprint 003)

---

## SUC-006: Navigate Reviews by Month

- **Actor**: Instructor (active)
- **Preconditions**: Instructor is logged in
- **Main Flow**:
  1. Instructor uses the month picker (present on Dashboard and Review List)
     to select any past or current month
  2. All review data on the current view filters to the selected month
  3. Selected month is preserved in the URL query string so it can be
     bookmarked or shared
- **Postconditions**: Displayed reviews match the selected month
- **Acceptance Criteria**:
  - [ ] Month picker defaults to the current calendar month
  - [ ] Selecting a month updates the review list without a full page reload
  - [ ] Month is reflected in the URL (`?month=YYYY-MM`)
