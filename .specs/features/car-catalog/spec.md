# Car Catalog Management — Specification

## Problem Statement

The platform needs a structured car catalog (Brand → Model → CarVersion) so users can browse vehicles and attach reviews to specific car versions. Without this, the core review feature has nothing to reference. Only admins should manage the catalog; all users can browse it.

## Goals

- [ ] Admins can fully manage the car catalog (CRUD for brands, models, car versions)
- [ ] Any user (including unauthenticated) can browse the catalog
- [ ] Slugs are auto-generated from names via a `Slug` value object
- [ ] Role-based guard prevents non-admin users from mutating the catalog

## Out of Scope

| Feature                                        | Reason                                             |
| ---------------------------------------------- | -------------------------------------------------- |
| Image uploads for brands/models                | Deferred to later milestone                        |
| Search and filtering                           | Deferred — simple list-by-parent is enough for now |
| Pagination                                     | Deferred to F8 (API Hardening milestone)           |
| Car version specs/details beyond schema fields | Current schema fields are sufficient               |
| Bulk import of cars                            | Not needed yet                                     |

---

## User Stories

### P1: Browse Car Catalog ⭐ MVP

**User Story**: As a visitor, I want to browse brands, models, and car versions so that I can find the car I want to review or read about.

**Why P1**: Without public read access, the catalog is useless to the community.

**Acceptance Criteria**:

1. WHEN a visitor requests all brands THEN system SHALL return a list of brands with id, name, and slug
2. WHEN a visitor requests a brand by slug THEN system SHALL return the brand details with its models
3. WHEN a visitor requests models for a brand THEN system SHALL return a list of models with id, name, slug, and brandId
4. WHEN a visitor requests a model by brand slug and model slug THEN system SHALL return the model details with its car versions
5. WHEN a visitor requests car versions for a model THEN system SHALL return a list of car versions with all fields
6. WHEN a visitor requests a car version by slug THEN system SHALL return the full car version details
7. WHEN a visitor requests a brand/model/version that doesn't exist THEN system SHALL return 404

**Independent Test**: Call GET endpoints without auth token and verify JSON responses with correct shapes.

---

### P1: Create Car Catalog Entries ⭐ MVP

**User Story**: As an admin, I want to create brands, models, and car versions so that the catalog is populated for users to browse and review.

**Why P1**: No catalog means no reviews — this is the foundation.

**Acceptance Criteria**:

1. WHEN an admin sends a valid brand name THEN system SHALL create the brand and auto-generate its slug
2. WHEN an admin sends a valid model name and brandId THEN system SHALL create the model and auto-generate its slug
3. WHEN an admin sends valid car version data (modelId, year, versionName, engine, transmission) THEN system SHALL create the car version and auto-generate its slug
4. WHEN a non-admin user attempts to create any catalog entry THEN system SHALL return 403 Forbidden
5. WHEN an unauthenticated user attempts to create any catalog entry THEN system SHALL return 401 Unauthorized
6. WHEN an admin sends a brand name that produces a duplicate slug THEN system SHALL return 400 with a meaningful error
7. WHEN an admin sends a model name that produces a duplicate slug within the same brand THEN system SHALL return 400
8. WHEN an admin sends a car version with a duplicate slug THEN system SHALL return 400

**Independent Test**: Authenticate as admin, POST to create endpoints, verify 201 responses. Attempt same as regular user, verify 403.

---

### P1: Update Car Catalog Entries ⭐ MVP

**User Story**: As an admin, I want to update brands, models, and car versions so that I can correct mistakes or update information.

**Why P1**: Admins need full CRUD to maintain catalog quality.

**Acceptance Criteria**:

1. WHEN an admin sends an updated name for a brand THEN system SHALL update the brand and regenerate its slug
2. WHEN an admin sends an updated name for a model THEN system SHALL update the model and regenerate its slug
3. WHEN an admin sends updated data for a car version THEN system SHALL update the car version and regenerate its slug if versionName changed
4. WHEN an admin updates a name that produces a duplicate slug THEN system SHALL return 400
5. WHEN a non-admin attempts to update THEN system SHALL return 403
6. WHEN the target entity doesn't exist THEN system SHALL return 404

**Independent Test**: Create an entry, update it, GET it back and verify changes.

---

### P1: Delete Car Catalog Entries ⭐ MVP

**User Story**: As an admin, I want to delete brands, models, and car versions so that I can remove incorrect or duplicate entries.

**Why P1**: Admins need full CRUD to maintain catalog quality.

**Acceptance Criteria**:

1. WHEN an admin deletes a brand THEN system SHALL remove the brand
2. WHEN an admin deletes a model THEN system SHALL remove the model
3. WHEN an admin deletes a car version THEN system SHALL remove the car version
4. WHEN a non-admin attempts to delete THEN system SHALL return 403
5. WHEN the target entity doesn't exist THEN system SHALL return 404
6. WHEN an admin deletes a brand that has models THEN system SHALL return 400 (prevent orphans)
7. WHEN an admin deletes a model that has car versions THEN system SHALL return 400 (prevent orphans)
8. WHEN an admin deletes a car version that has reviews THEN system SHALL return 400 (prevent orphans)

**Independent Test**: Create an entry with no children, delete it, verify 200. Try deleting one with children, verify 400.

---

### P1: Slug Value Object ⭐ MVP

**User Story**: As a developer, I want a reusable `Slug` value object so that slug generation is consistent and testable across all catalog entities.

**Why P1**: Every catalog entity needs slugs — centralizing the logic prevents inconsistency.

**Acceptance Criteria**:

1. WHEN `Slug.create("Toyota Corolla")` is called THEN it SHALL return `"toyota-corolla"`
2. WHEN the input has accented characters (e.g., "Citroën") THEN it SHALL transliterate them (e.g., `"citroen"`)
3. WHEN the input has special characters or multiple spaces THEN it SHALL strip them and use single hyphens
4. WHEN the input is empty or whitespace-only THEN it SHALL throw an error
5. WHEN `Slug.create` is called for a CarVersion THEN the slug SHALL incorporate year + versionName (e.g., `"2024-corolla-xei-20"`)

**Independent Test**: Unit test the Slug class with various inputs including accented chars, special chars, edge cases.

---

### P1: Admin Role Guard ⭐ MVP

**User Story**: As the system, I want to enforce admin-only access on catalog mutation endpoints so that unauthorized users cannot modify the catalog.

**Why P1**: Without this, anyone can modify the catalog. Prerequisite for all write operations.

**Acceptance Criteria**:

1. WHEN a request hits an endpoint decorated with `@AdminOnly()` THEN system SHALL check the user's roles
2. WHEN the authenticated user has a Role with type ADMIN THEN system SHALL allow the request
3. WHEN the authenticated user has no ADMIN role THEN system SHALL return 403 Forbidden
4. WHEN `@AdminOnly()` is combined with `@IsPublic()` THEN `@IsPublic()` SHALL take precedence (defensive — shouldn't happen but must not break)
5. WHEN the JWT is valid but the user has been deleted THEN system SHALL return 403 (existing auth behavior)

**Independent Test**: Call a protected endpoint as admin (200), as regular user (403), as unauthenticated (401).

---

## Edge Cases

- WHEN a brand slug collision occurs from different names (e.g., "BMW" and "B.M.W.") THEN system SHALL return 400 on the second create
- WHEN an admin creates a car version with null optional fields (engine, transmission) THEN system SHALL accept and store nulls
- WHEN a slug would be empty after stripping (e.g., name is "---") THEN Slug value object SHALL throw an error
- WHEN an admin updates only the engine of a car version (not versionName) THEN system SHALL NOT regenerate the slug

---

## Requirement Traceability

| Requirement ID | Story                                               | Phase  | Status  |
| -------------- | --------------------------------------------------- | ------ | ------- |
| CAR-01         | P1: Browse — List brands                            | Design | Pending |
| CAR-02         | P1: Browse — Get brand by slug with models          | Design | Pending |
| CAR-03         | P1: Browse — List models by brand                   | Design | Pending |
| CAR-04         | P1: Browse — Get model by slugs with versions       | Design | Pending |
| CAR-05         | P1: Browse — List car versions by model             | Design | Pending |
| CAR-06         | P1: Browse — Get car version by slug                | Design | Pending |
| CAR-07         | P1: Browse — 404 on not found                       | Design | Pending |
| CAR-08         | P1: Create — Brand with auto-slug                   | Design | Pending |
| CAR-09         | P1: Create — Model with auto-slug                   | Design | Pending |
| CAR-10         | P1: Create — CarVersion with auto-slug              | Design | Pending |
| CAR-11         | P1: Create — 403 for non-admin                      | Design | Pending |
| CAR-12         | P1: Create — 400 on duplicate slug                  | Design | Pending |
| CAR-13         | P1: Update — Brand with slug regen                  | Design | Pending |
| CAR-14         | P1: Update — Model with slug regen                  | Design | Pending |
| CAR-15         | P1: Update — CarVersion with conditional slug regen | Design | Pending |
| CAR-16         | P1: Update — 400 on duplicate slug                  | Design | Pending |
| CAR-17         | P1: Update — 404 on not found                       | Design | Pending |
| CAR-18         | P1: Delete — Brand (no children)                    | Design | Pending |
| CAR-19         | P1: Delete — Model (no children)                    | Design | Pending |
| CAR-20         | P1: Delete — CarVersion (no reviews)                | Design | Pending |
| CAR-21         | P1: Delete — 400 on has children                    | Design | Pending |
| CAR-22         | P1: Slug — Value object with transliteration        | Design | Pending |
| CAR-23         | P1: Slug — CarVersion composite slug                | Design | Pending |
| CAR-24         | P1: Admin guard — Role check decorator + guard      | Design | Pending |
| CAR-25         | P1: Admin guard — 403 for non-admin                 | Design | Pending |

**Coverage:** 25 total, 0 mapped to tasks, 25 unmapped ⚠️

---

## Success Criteria

- [ ] All 6 GET endpoints return correct data publicly (no auth)
- [ ] All 9 mutation endpoints (3 create + 3 update + 3 delete) enforce admin-only access
- [ ] Slugs are auto-generated consistently via the Slug value object
- [ ] Duplicate slugs are rejected with 400
- [ ] Deleting entities with children is rejected with 400
- [ ] All use cases have unit tests
- [ ] Slug value object has comprehensive unit tests
