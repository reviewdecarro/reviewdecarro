# Design: Fix reviews-by-username filter

**Date:** 2026-05-04

## Problem

`GET /reviews?username=<value>` does not work. The controller receives the username query param but stores it in a variable named `userId`, then passes it to the use case and repository as `userId`. The Prisma repository filters by `where.userId`, which expects a UUID — so the username string never matches anything.

## Solution

Rename the filter field from `userId` to `username` across all layers. The Prisma repository resolves the filter via `where: { user: { username } }`, which Prisma translates to a single JOIN — no extra query.

## Files Changed

| File | Change |
|------|--------|
| `application/reviews/repositories/reviews.repository.ts` | `userId?: string` → `username?: string` in `findAll` filter |
| `infra/database/prisma/repositories/prisma-reviews.repository.ts` | `where.userId = ...` → `where.user = { username: ... }` |
| `application/reviews/repositories/in-memory-reviews.repository.ts` | Filter by `r.user?.username` instead of `r.userId` |
| `application/reviews/use-cases/list-reviews.usecase.ts` | `userId` → `username` in the filter type |
| `infra/http/controllers/reviews/reviews.controller.ts` | Rename local variable `userId` → `username` |
| `application/reviews/use-cases/list-reviews.usecase.spec.ts` | Update "filter by userId" test to use username; add `user` field to `makeReview()` |

## API Surface

No change. `GET /reviews?username=<username>` is already the documented query param. This fix makes it work as intended.

## Architecture

No new dependencies or cross-domain coupling introduced. The fix stays within the reviews domain — the Prisma join handles user resolution at the database level.

## Error Handling

No new error cases. An unknown username returns an empty array (same behavior as any filter that matches nothing).

## Testing

Update the existing "filter by userId" unit test in `list-reviews.usecase.spec.ts`:
- Pass `{ username: "user1" }` to `execute()`
- Set `user: { id: "u1", username: "user1" }` on review items in `makeReview()`
