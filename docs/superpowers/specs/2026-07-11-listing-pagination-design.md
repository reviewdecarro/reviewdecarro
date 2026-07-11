# Listing Pagination — Design

**Date:** 2026-07-11
**Status:** Approved

## Goal

Add pagination to the two default (non-search) community listings:

- **Forum** (`/forum`): 30 topics per page, "Anterior" / "Próximo" navigation.
- **Reviews** (`/reviews`): 12 reviews per page, "Anterior" / "Próximo" navigation, with the featured (top-scored) review pinned on every page and excluded from the paginated list.

## Context & Constraints

- **Search results already paginate.** When a query is present, dedicated search endpoints return `meta: { page, limit, total, totalPages }` and the UI renders `SearchResultsControls` (sort dropdown + prev/next). This design mirrors that pattern for the default listings.
- **The list endpoints have other consumers.** The homepage (`app/page.tsx`) and the profile page (`app/profile/profile-client.tsx`) both call `fetchForumTopics()` / `fetchPublicReviews()` and expect **all** rows. Therefore pagination MUST be **opt-in** — applied only when `page`/`limit` query params are present. Absent those params, endpoints behave exactly as today.
- **Backend pagination** (not client-side): scales with data, only transfers one page, and matches the existing search pattern's `skip`/`take` + `count` mechanics.
- **Wording:** buttons read **"Anterior"** and **"Próximo"**. The shared component is used by search too, so search's prev/next inherits the same labels (previously "Próxima").

## Architecture Overview

| Layer | Forum | Reviews |
| --- | --- | --- |
| Endpoint | `GET /forum/topics?page=&limit=` (opt-in, default limit 30) | **new** `GET /reviews/public?page=&limit=` (default limit 12) |
| Response | `{ topics, meta }` | `{ featured, reviews, meta }` |
| Repository | `findAll` returns `{ topics, total }` | **new** `findFeatured()`, **new** `findPaginated()` |
| Use case | `ListForumTopicsUseCase` → `{ items, meta }` | **new** `ListPublicReviewsUseCase` → `{ featured, items, meta }` |

`meta` shape everywhere: `{ page: number; limit: number; total: number; totalPages: number }` (same as search).

## Backend — Forum

**`ForumTopicsRepositoryProps.findAll(filters?)`**
- Signature changes to accept `{ query?: string; page?: number; limit?: number }`.
- Return type changes from `ForumTopicEntity[]` to `{ topics: ForumTopicEntity[]; total: number }`.
- Prisma impl: when `page` is provided, add `skip: (page - 1) * limit`, `take: limit`, and a `prisma.forumTopic.count({ where })` using the same `where`. When `page` is absent, no `skip`/`take`; `total = topics.length`.
- The `where` clause (status `PUBLISHED`, `deletedAt: null`, optional query OR-filter) and `orderBy: { createdAt: "desc" }` are unchanged.
- In-memory repository and any `*.spec.ts` referencing `findAll` are updated to the new return shape.

**`ListForumTopicsUseCase.execute({ query?, page?, limit? })`**
- Calls `findAll`, maps entities via `ForumTopicMapper.toResponseDto`.
- Returns `{ items, meta }`. `limit` defaults to 30 when `page` is present. When `page` is absent, `meta = { page: 1, limit: total, total, totalPages: 1 }`.

**Controller `GET /forum/topics`**
- Adds `@Query("page")` and `@Query("limit")` (parsed to positive integers; invalid → undefined).
- Responds `{ topics: items, meta }`. Existing array consumers ignore `meta`.

## Backend — Reviews

The generic `GET /reviews`, `ListReviewsUseCase`, and `ReviewsRepositoryProps.findAll` stay **exactly as-is** (used by homepage + profile). Pagination + featured live in a new, dedicated path.

**`ReviewsRepositoryProps` — two new methods:**
- `findFeatured(): Promise<ReviewEntity | null>` — the single top-scored review (`orderBy: { score: "desc" }`, then `createdAt: "desc"` as tiebreak), or `null` when there are no reviews. No status filter (parity with current listing).
- `findPaginated(params: { page: number; limit: number; excludeId?: string }): Promise<{ items: ReviewEntity[]; total: number }>` — `orderBy: { createdAt: "desc" }`, `skip`/`take`, `where` excludes `excludeId` (`id: { not: excludeId }`) when provided; `total` from a matching `count`.

**`ListPublicReviewsUseCase.execute({ page?, limit? })`** (new)
- `limit` defaults to 12, `page` defaults to 1.
- `featured = await findFeatured()`.
- `{ items, total } = await findPaginated({ page, limit, excludeId: featured?.id })`.
- Maps featured + items via `ReviewsMapper.toReviewResponseDto`.
- Returns `{ featured, items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }`.
- Edge cases: 0 reviews → `featured: null`, `items: []`, `total: 0`, `totalPages: 0`. Exactly 1 review → featured set, `items: []`, `total: 0`, `totalPages: 0` (matches today's behavior of showing the featured banner with an empty list).

**New controller `GET /reviews/public`**
- `@IsPublic()`, `@Query("page")`, `@Query("limit")`.
- Responds `{ featured, reviews: items, meta }`.
- Registered in the reviews HTTP module; `ListPublicReviewsUseCase` added as a provider.

## Web — Shared Pagination Component

**New `components/PaginationControls.tsx`** (`"use client"`)
- Props: `{ page: number; totalPages: number }`.
- Renders "Anterior" / "Próximo" buttons + `{page} de {totalPages}` label.
- Renders `null` when `totalPages <= 1`.
- Updates the `page` URL param via `usePathname` + `useSearchParams` + `router.replace(url, { scroll: false })`; deletes `page` when navigating to page 1. Same mechanism as the current `SearchResultsControls`.
- Buttons disabled at bounds (`page <= 1` / `page >= totalPages`).

**Refactor `components/SearchResultsControls.tsx`**
- Keeps the sort dropdown.
- Delegates prev/next rendering to `PaginationControls` (single source of truth). Search continues to work; its buttons now read "Próximo".

## Web — Fetchers

**`api/forum.ts` — new `fetchForumTopicsPage({ page, limit? })`**
- Calls `GET /forum/topics?page=<page>&limit=<limit ?? 30>`.
- Returns `{ items: ForumTopicSummary[]; meta }` (maps topics via existing `toForumTopicSummary`). On error, returns `{ items: [], meta: { page: 1, limit: 30, total: 0, totalPages: 0 } }`.
- Existing `fetchForumTopics()` (array) is unchanged.

**`api/reviews.ts` — new `fetchPublicReviewsPage({ page, limit? })`**
- Calls `GET /reviews/public?page=<page>&limit=<limit ?? 12>`.
- Returns `{ featured: PublicReview | null; items: PublicReview[]; meta }` (maps via existing `toPublicReview`). On error, returns `{ featured: null, items: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } }`.
- Existing `fetchPublicReviews()` (array) is unchanged.

## Web — Page Wiring

**`app/forum/page.tsx` + `app/forum/forum-page.tsx`**
- Non-search path calls `fetchForumTopicsPage({ page })` instead of `fetchForumTopics()`, passing `meta` down.
- `ForumPage` renders `PaginationControls` in the default (non-search) case; the title count uses `meta.total`. Search path keeps `SearchResultsControls`.

**`app/reviews/page.tsx`**
- Non-search path calls `fetchPublicReviewsPage({ page })`.
- Featured banner from `featured`; list from `items`; `PaginationControls` rendered below the list. Search path unchanged.

**Untouched:** `app/page.tsx` (homepage) and `app/profile/profile-client.tsx` continue calling the array fetchers with no `page` param, so their endpoints return everything as before.

## Testing

- **Forum repository / use case:** paginated `findAll` returns correct slice + `total`; absent `page` returns all rows with `total = length`.
- **Reviews `ListPublicReviewsUseCase`:** featured is top-scored and excluded from `items`; `meta.total` counts all-minus-featured; 0-review and 1-review edge cases.
- **Controllers:** `GET /forum/topics?page=2&limit=30` returns `{ topics, meta }`; `GET /reviews/public?page=1` returns `{ featured, reviews, meta }`.
- **Web:** `PaginationControls` renders nothing at `totalPages <= 1`, disables buttons at bounds, and updates the URL.

## Out of Scope (YAGNI)

- Page-number links / jump-to-page (only prev/next requested).
- Changing search behavior beyond the shared button labels.
- Status filtering on the reviews listing (preserves current behavior).
- Per-page-size user controls.
