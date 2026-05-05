# Roadmap

## Milestone 1: Core API — application CRUD ✦ Current Focus

Build out the 4 remaining API applications following the established users pattern.

### Features

| ID  | Feature                                                | application | Depends On | Size   | Status      |
| --- | ------------------------------------------------------ | ----------- | ---------- | ------ | ----------- |
| F1  | Car catalog management (Brand, Model, CarVersion CRUD) | cars        | —          | Large  | Not started |
| F2  | Review creation and retrieval                          | reviews     | F1         | Large  | Not started |
| F3  | Review ratings (per-category scoring)                  | reviews     | F2         | Medium | Not started |
| F4  | Comments on reviews                                    | comments    | F2         | Medium | Not started |
| F5  | Review voting (up/down)                                | votes       | F2         | Medium | Not started |
| F6  | Role-based authorization (admin guard)                 | users       | —          | Medium | Not started |

### Priority Order

1. **F1 — Cars** (prerequisite for reviews)
2. **F6 — RBAC** (admin-only car catalog management)
3. **F2 — Reviews** (core feature, depends on cars)
4. **F3 — Ratings** (extends reviews)
5. **F4 — Comments** (community feature)
6. **F5 — Votes** (engagement feature)

---

## Milestone 2: API Hardening

| ID  | Feature                                                 | Size   | Status      |
| --- | ------------------------------------------------------- | ------ | ----------- |
| F7  | E2E test suite for critical flows                       | Medium | Not started |
| F8  | Pagination and filtering for list endpoints             | Medium | Not started |
| F9  | Error type expansion (NotFound, Conflict, Unauthorized) | Small  | Not started |
| F10 | Input sanitization and rate limiting                    | Small  | Not started |

---

## Milestone 3: Web Frontend

| ID  | Feature                      | Size   | Status      |
| --- | ---------------------------- | ------ | ----------- |
| F11 | Auth pages (register, login) | Medium | Not started |
| F12 | Car catalog browsing         | Medium | Not started |
| F13 | Review browsing and creation | Large  | Not started |
| F14 | Comments and voting UI       | Medium | Not started |

---

## Milestone 4: Polish & Launch

| ID  | Feature                              | Size   | Status      |
| --- | ------------------------------------ | ------ | ----------- |
| F15 | Search and filtering                 | Medium | Not started |
| F16 | User profiles                        | Small  | Not started |
| F17 | Admin panel (car catalog management) | Large  | Not started |
| F18 | CI/CD pipeline                       | Medium | Not started |
