---
status: draft
---

# Sprint 001 Use Cases

## SUC-001: Developer Logs In as a Test Role

- **Actor**: Developer (using the app in dev/test mode)
- **Preconditions**: Server is running with stub auth enabled
- **Main Flow**:
  1. Developer (or login page) posts `{ role: "admin" | "instructor" | "inactive" }` to `POST /api/auth/login`
  2. Server synthesises a fake user object for the requested role and stores it in the session
  3. Server returns the user object with role flags
  4. Client redirects to the role-appropriate page:
     - `admin` → `/admin`
     - `instructor` → `/dashboard`
     - `inactive` → `/pending-activation`
- **Postconditions**: Session established with fake user; correct page displayed
- **Acceptance Criteria**:
  - [ ] `POST /api/auth/login` with `{ role: "admin" }` creates session and returns admin user
  - [ ] `POST /api/auth/login` with `{ role: "instructor" }` creates session and returns active instructor
  - [ ] `POST /api/auth/login` with `{ role: "inactive" }` creates session and returns inactive instructor
  - [ ] Invalid role returns 400

---

## SUC-002: Developer Logs Out

- **Actor**: Authenticated developer
- **Preconditions**: Active session exists
- **Main Flow**:
  1. Client posts to `POST /api/auth/logout`
  2. Server destroys the session
  3. Client redirects to `/login`
- **Postconditions**: Session destroyed; login page shown
- **Acceptance Criteria**:
  - [ ] After logout, `GET /api/auth/me` returns 401
  - [ ] Client redirects to `/login`

---

## SUC-003: Unauthenticated User Is Redirected to Login

- **Actor**: Visitor (no session)
- **Preconditions**: None
- **Main Flow**:
  1. Visitor navigates to a protected route (`/dashboard`, `/admin`, etc.)
  2. Client calls `GET /api/auth/me`; receives 401
  3. Client redirects to `/login`
- **Postconditions**: Visitor sees the Login page
- **Acceptance Criteria**:
  - [ ] `/dashboard` without session → redirect to `/login`
  - [ ] `/admin` without session → redirect to `/login`
  - [ ] Protected API routes return 401 without a session
