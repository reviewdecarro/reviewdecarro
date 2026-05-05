# Reviews by Username Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `GET /reviews?username=<value>` so it correctly filters reviews by the author's username.

**Architecture:** Rename the filter field from `userId` to `username` across the abstract repository, in-memory repository, use case, Prisma repository, and controller. The Prisma repository resolves the filter via `where: { user: { username } }` — a single JOIN, no extra query.

**Tech Stack:** NestJS, Prisma 7, Jest 30 with ts-jest, TypeScript

---

## Files Modified

| File | Change |
|------|--------|
| `apps/api/src/application/reviews/use-cases/list-reviews.usecase.spec.ts` | Update "filter by userId" test to use username |
| `apps/api/src/application/reviews/repositories/reviews.repository.ts` | `userId?: string` → `username?: string` in `findAll` filter |
| `apps/api/src/application/reviews/repositories/in-memory-reviews.repository.ts` | Filter by `r.user?.username` instead of `r.userId` |
| `apps/api/src/application/reviews/use-cases/list-reviews.usecase.ts` | `userId` → `username` in filter type |
| `apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts` | `where.userId = ...` → `where.user = { username: ... }` |
| `apps/api/src/infra/http/controllers/reviews/reviews.controller.ts` | Rename local variable `userId` → `username` |

---

## Task 1: Update the unit test (write failing test)

**Files:**
- Modify: `apps/api/src/application/reviews/use-cases/list-reviews.usecase.spec.ts`

- [ ] **Step 1: Update `makeReview` to support the `user` field**

Replace `makeReview` in `list-reviews.usecase.spec.ts`:

```typescript
function makeReview(overrides: Partial<ReviewEntity> = {}): ReviewEntity {
  return new ReviewEntity({
    id: overrides.id ?? "r1",
    userId: overrides.userId ?? "user-1",
    user: overrides.user,
    carVersionYearId: overrides.carVersionYearId ?? "year-1",
    title: overrides.title ?? "Title",
    content: overrides.content ?? "Content",
    pros: null,
    cons: null,
    ownershipTimeMonths: null,
    kmDriven: null,
    score: 4,
    createdAt: overrides.createdAt ?? new Date(),
    updatedAt: new Date(),
  });
}
```

- [ ] **Step 2: Replace the "filter by userId" test with a "filter by username" test**

Replace the existing `it("should filter by userId", ...)` block:

```typescript
it("should filter by username", async () => {
  reviewsRepository.items.push(
    makeReview({ id: "a", userId: "u1", user: { id: "u1", username: "alice" } }),
    makeReview({ id: "b", userId: "u2", user: { id: "u2", username: "bob" } }),
  );

  const result = await sut.execute({ username: "alice" });

  expect(result).toHaveLength(1);
  expect(result[0]).toHaveProperty("userId", "u1");
});
```

- [ ] **Step 3: Run the test and verify it fails**

From `apps/api`:
```bash
pnpm test -- --testPathPatterns=list-reviews
```

Expected: FAIL — TypeScript compile error: `username` does not exist on the filter type (since implementation still uses `userId`).

---

## Task 2: Fix all implementation layers

**Files:**
- Modify: `apps/api/src/application/reviews/repositories/reviews.repository.ts`
- Modify: `apps/api/src/application/reviews/repositories/in-memory-reviews.repository.ts`
- Modify: `apps/api/src/application/reviews/use-cases/list-reviews.usecase.ts`
- Modify: `apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts`
- Modify: `apps/api/src/infra/http/controllers/reviews/reviews.controller.ts`

- [ ] **Step 1: Update the abstract repository interface**

In `apps/api/src/application/reviews/repositories/reviews.repository.ts`, replace the `findAll` signature:

```typescript
abstract findAll(filters?: {
  carVersionYearId?: string;
  username?: string;
  query?: string;
}): Promise<ReviewEntity[]>;
```

- [ ] **Step 2: Update the in-memory repository**

In `apps/api/src/application/reviews/repositories/in-memory-reviews.repository.ts`, replace the `findAll` method:

```typescript
async findAll(filters?: {
  carVersionYearId?: string;
  username?: string;
  query?: string;
}): Promise<ReviewEntity[]> {
  let result = [...this.items];

  if (filters?.carVersionYearId) {
    result = result.filter(
      (r) => r.carVersionYearId === filters.carVersionYearId,
    );
  }

  if (filters?.username) {
    result = result.filter((r) => r.user?.username === filters.username);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q),
    );
  }

  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
```

- [ ] **Step 3: Update the use case**

In `apps/api/src/application/reviews/use-cases/list-reviews.usecase.ts`, replace the `execute` signature:

```typescript
async execute(filters?: {
  carVersionYearId?: string;
  username?: string;
  query?: string;
}) {
  const reviews = await this.reviewsRepository.findAll(filters);

  return reviews.map((review) =>
    ReviewsMapper.toReviewResponseDto(new ReviewEntity(review)),
  );
}
```

- [ ] **Step 4: Update the Prisma repository**

In `apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts`, update the `findAll` method signature and the `userId` filter block:

Change the method signature from:
```typescript
async findAll(filters?: {
  carVersionYearId?: string;
  userId?: string;
  query?: string;
}): Promise<ReviewEntity[]> {
```
To:
```typescript
async findAll(filters?: {
  carVersionYearId?: string;
  username?: string;
  query?: string;
}): Promise<ReviewEntity[]> {
```

Replace the `userId` filter block:
```typescript
if (filters?.username) {
  where.user = { username: filters.username };
}
```

(Remove the old `if (filters?.userId) { where.userId = filters.userId; }` block.)

- [ ] **Step 5: Update the controller**

In `apps/api/src/infra/http/controllers/reviews/reviews.controller.ts`, replace the `list` handler:

```typescript
@Get()
@IsPublic()
@ApiOperation({ description: "Listar reviews com filtros" })
@ApiQuery({ name: "carVersionYearId", required: false })
@ApiQuery({ name: "username", required: false })
@ApiQuery({ name: "q", required: false })
@ApiOkResponse({ description: "Lista de reviews" })
async list(
  @Query("carVersionYearId") carVersionYearId: string,
  @Query("username") username: string,
  @Query("q") query: string,
  @Res() res: Response,
) {
  const reviews = await this.listReviewsService.execute({
    carVersionYearId,
    username,
    query,
  });

  return res.status(HttpStatus.OK).json({ reviews });
}
```

- [ ] **Step 6: Run the tests and verify they pass**

From `apps/api`:
```bash
pnpm test -- --testPathPatterns=list-reviews
```

Expected output:
```
PASS src/application/reviews/use-cases/list-reviews.usecase.spec.ts
  ListReviewsUseCase
    ✓ should return all reviews when no filters given
    ✓ should filter by carVersionYearId
    ✓ should filter by username
    ✓ should filter by query (case-insensitive, title or content)
```

- [ ] **Step 7: Commit**

```bash
git add \
  apps/api/src/application/reviews/repositories/reviews.repository.ts \
  apps/api/src/application/reviews/repositories/in-memory-reviews.repository.ts \
  apps/api/src/application/reviews/use-cases/list-reviews.usecase.ts \
  apps/api/src/application/reviews/use-cases/list-reviews.usecase.spec.ts \
  apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts \
  apps/api/src/infra/http/controllers/reviews/reviews.controller.ts
git commit -m "fix: filter reviews by username instead of userId"
```
