# Listing Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add opt-in backend pagination to the default forum listing (30/page) and reviews listing (12/page, with the top-scored review pinned on every page and excluded from the list), plus "Anterior"/"Próximo" navigation on both pages.

**Architecture:** Backend pagination mirroring the existing search pattern (`skip`/`take` + `count`, `meta: {page, limit, total, totalPages}`). Forum reuses its `GET /forum/topics` endpoint with new optional `page`/`limit` params. Reviews get a new dedicated `GET /reviews/public` endpoint returning `{ featured, reviews, meta }` so the generic `/reviews` endpoint (used by homepage/profile) is untouched. The web layer gets one reusable `PaginationControls` component and two new paginated fetchers.

**Tech Stack:** NestJS + Prisma 7 (API), Next.js App Router (web), Jest 30 (tests).

## Global Constraints

- Pagination is **opt-in**: when no `page` param is passed, endpoints return all rows exactly as today (homepage + profile depend on this).
- `meta` shape everywhere: `{ page: number; limit: number; total: number; totalPages: number }`.
- Forum default `limit` = 30; reviews default `limit` = 12.
- Button labels: **"Anterior"** and **"Próximo"**.
- Conventional commits, plain `-m` strings, no Co-Authored-By (per CLAUDE.md).
- Test files: `*.spec.ts` next to source; import from `@jest/globals`; run with `--testPathPatterns`.
- Run all API commands from `apps/api`. Run web build from repo root.

---

### Task 1: Forum repository pagination

**Files:**
- Modify: `apps/api/src/application/forum/repositories/forum-topics.repository.ts`
- Modify: `apps/api/src/application/forum/repositories/in-memory-forum-topics.repository.ts`
- Modify: `apps/api/src/infra/database/prisma/repositories/prisma-forum-topics.repository.ts`

**Interfaces:**
- Produces: `ForumTopicsRepositoryProps.findAll(filters?: { query?: string; page?: number; limit?: number }): Promise<{ topics: ForumTopicEntity[]; total: number }>`

- [ ] **Step 1: Update the abstract repository signature**

In `apps/api/src/application/forum/repositories/forum-topics.repository.ts`, replace the `findAll` line:

```typescript
	abstract findAll(filters?: {
		query?: string;
		page?: number;
		limit?: number;
	}): Promise<{ topics: ForumTopicEntity[]; total: number }>;
```

- [ ] **Step 2: Update the in-memory implementation**

In `apps/api/src/application/forum/repositories/in-memory-forum-topics.repository.ts`, replace the whole `findAll` method:

```typescript
	async findAll(filters?: {
		query?: string;
		page?: number;
		limit?: number;
	}): Promise<{ topics: ForumTopicEntity[]; total: number }> {
		const query = filters?.query?.toLowerCase();

		const filtered = this.items
			.filter((topic) => topic.status === ForumTopicStatus.PUBLISHED)
			.filter(
				(topic) =>
					!query ||
					topic.title.toLowerCase().includes(query) ||
					topic.content.toLowerCase().includes(query),
			)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

		const total = filtered.length;

		if (filters?.page && filters?.limit) {
			const start = (filters.page - 1) * filters.limit;
			return { topics: filtered.slice(start, start + filters.limit), total };
		}

		return { topics: filtered, total };
	}
```

- [ ] **Step 3: Update the Prisma implementation**

In `apps/api/src/infra/database/prisma/repositories/prisma-forum-topics.repository.ts`, replace the whole `findAll` method (currently around lines 41-70) with:

```typescript
	async findAll(filters?: {
		query?: string;
		page?: number;
		limit?: number;
	}): Promise<{ topics: ForumTopicEntity[]; total: number }> {
		const where = {
			status: ForumTopicStatus.PUBLISHED,
			deletedAt: null,
			...(filters?.query
				? {
						OR: [
							{
								title: {
									contains: filters.query,
									mode: "insensitive" as const,
								},
							},
							{
								content: {
									contains: filters.query,
									mode: "insensitive" as const,
								},
							},
						],
					}
				: {}),
		};

		const paginate =
			filters?.page && filters?.limit
				? {
						skip: (filters.page - 1) * filters.limit,
						take: filters.limit,
					}
				: {};

		const [topics, total] = await Promise.all([
			this.prisma.forumTopic.findMany({
				where,
				include: forumTopicInclude,
				orderBy: { createdAt: "desc" },
				...paginate,
			}),
			this.prisma.forumTopic.count({ where }),
		]);

		return { topics: topics.map((topic) => new ForumTopicEntity(topic)), total };
	}
```

- [ ] **Step 4: Verify it compiles**

Run: `cd apps/api && pnpm exec tsc --noEmit -p tsconfig.json`
Expected: PASS (no errors). If `list-forum-topics.usecase.ts` now errors because `findAll` returns an object, that is expected — it is fixed in Task 2.

Note: `list-forum-topics.usecase.ts` will show a type error until Task 2. That is the only acceptable error here. If any other file errors, fix it before continuing.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/application/forum/repositories apps/api/src/infra/database/prisma/repositories/prisma-forum-topics.repository.ts
git commit -m "feat(api): return total alongside forum topics for pagination"
```

---

### Task 2: Forum use case + controller pagination

**Files:**
- Modify: `apps/api/src/application/forum/use-cases/list-forum-topics.usecase.ts`
- Modify: `apps/api/src/application/forum/use-cases/list-forum-topics.usecase.spec.ts`
- Modify: `apps/api/src/infra/http/controllers/forum/forum.controller.ts`

**Interfaces:**
- Consumes: `findAll(...) => { topics, total }` (Task 1)
- Produces: `ListForumTopicsUseCase.execute(filters?: { query?; page?; limit? }) => Promise<{ items: ForumTopicResponseDto[]; meta: { page; limit; total; totalPages } }>`

- [ ] **Step 1: Update the failing use-case spec**

The existing spec expects `execute()` to resolve to an array. Update it to the new `{ items, meta }` shape. In `apps/api/src/application/forum/use-cases/list-forum-topics.usecase.spec.ts`:

Replace the assertions in the "should return topics" test (around lines 61-65):

```typescript
		const result = await sut.execute();

		expect(result.items).toHaveLength(2);
		expect(result.items[0]).toHaveProperty("slug", "terceiro");
		expect(result.items[1]).toHaveProperty("slug", "primeiro");
		expect(result.meta.total).toBe(2);
```

Replace the three query assertions at the end (around lines 100-107):

```typescript
		expect((await sut.execute({ query: "MANUTENÇÃO" })).items).toEqual([
			expect.objectContaining({ id: "topic-title" }),
		]);
		expect((await sut.execute({ query: "híbridos" })).items).toEqual([
			expect.objectContaining({ id: "topic-content" }),
		]);
		expect((await sut.execute({ query: "inexistente" })).items).toEqual([]);
```

Then add a new pagination test at the end of the `describe` block (before its closing `});`):

```typescript
	it("should paginate topics and report meta", async () => {
		for (let i = 0; i < 5; i++) {
			topicsRepository.items.push(
				new ForumTopicEntity({
					id: `topic-${i}`,
					authorId: "user-1",
					title: `Topico ${i}`,
					slug: `topico-${i}`,
					content: "Conteúdo",
					status: "PUBLISHED" as never,
					postsCount: 0,
					upvotes: 0,
					downvotes: 0,
					createdAt: new Date(2024, 0, i + 1),
					updatedAt: new Date(2024, 0, i + 1),
					deletedAt: null,
				}),
			);
		}

		const result = await sut.execute({ page: 1, limit: 2 });

		expect(result.items).toHaveLength(2);
		expect(result.meta).toEqual({
			page: 1,
			limit: 2,
			total: 5,
			totalPages: 3,
		});
	});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run: `cd apps/api && pnpm test -- --testPathPatterns=list-forum-topics.usecase`
Expected: FAIL (execute returns an array / `result.items` undefined).

- [ ] **Step 3: Implement the use-case change**

Replace the whole body of `apps/api/src/application/forum/use-cases/list-forum-topics.usecase.ts`:

```typescript
import { Injectable } from "@nestjs/common";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicMapper } from "../mappers/forum-topic.mapper";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class ListForumTopicsUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute(filters?: { query?: string; page?: number; limit?: number }) {
		const { topics, total } = await this.forumTopicsRepository.findAll(filters);

		const items = topics.map((topic) =>
			ForumTopicMapper.toResponseDto(new ForumTopicEntity(topic)),
		);

		const page = filters?.page ?? 1;
		const limit = filters?.limit ?? total;
		const totalPages =
			filters?.page && filters?.limit ? Math.ceil(total / filters.limit) : 1;

		return { items, meta: { page, limit, total, totalPages } };
	}
}
```

- [ ] **Step 4: Run the spec to verify it passes**

Run: `cd apps/api && pnpm test -- --testPathPatterns=list-forum-topics.usecase`
Expected: PASS.

- [ ] **Step 5: Update the controller**

In `apps/api/src/infra/http/controllers/forum/forum.controller.ts`, replace the `listTopics` handler (the `@Get("topics")` block) with:

```typescript
	@Get("topics")
	@IsPublic()
	@ApiOperation({ description: "Listar tópicos do fórum" })
	@ApiQuery({ name: "q", required: false })
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "limit", required: false })
	@ApiOkResponse({ description: "Lista de tópicos" })
	async listTopics(
		@Query("q") query: string,
		@Query("page") pageParam: string,
		@Query("limit") limitParam: string,
		@Res() res: Response,
	) {
		const page = Number.parseInt(pageParam, 10);
		const limit = Number.parseInt(limitParam, 10);
		const { items, meta } = await this.listForumTopicsUseCase.execute({
			query,
			page: Number.isInteger(page) && page > 0 ? page : undefined,
			limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
		});

		return res.status(HttpStatus.OK).json({ topics: items, meta });
	}
```

- [ ] **Step 6: Verify compile + full forum suite**

Run: `cd apps/api && pnpm exec tsc --noEmit -p tsconfig.json && pnpm test -- --testPathPatterns=forum`
Expected: PASS (compiles; all forum specs green).

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/application/forum/use-cases apps/api/src/infra/http/controllers/forum/forum.controller.ts
git commit -m "feat(api): paginate forum topics listing endpoint"
```

---

### Task 3: Reviews repository — findFeatured + findPaginated

**Files:**
- Modify: `apps/api/src/application/reviews/repositories/reviews.repository.ts`
- Modify: `apps/api/src/application/reviews/repositories/in-memory-reviews.repository.ts`
- Modify: `apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts`

**Interfaces:**
- Produces:
  - `ReviewsRepositoryProps.findFeatured(): Promise<ReviewEntity | null>`
  - `ReviewsRepositoryProps.findPaginated(params: { page: number; limit: number; excludeId?: string }): Promise<{ items: ReviewEntity[]; total: number }>`
- `findAll` is unchanged.

- [ ] **Step 1: Add the two abstract methods**

In `apps/api/src/application/reviews/repositories/reviews.repository.ts`, add after the existing `findAll` declaration (before `update`):

```typescript
	abstract findFeatured(): Promise<ReviewEntity | null>;
	abstract findPaginated(params: {
		page: number;
		limit: number;
		excludeId?: string;
	}): Promise<{ items: ReviewEntity[]; total: number }>;
```

- [ ] **Step 2: Implement in the in-memory repository**

In `apps/api/src/application/reviews/repositories/in-memory-reviews.repository.ts`, add these two methods immediately after the existing `findAll` method:

```typescript
	async findFeatured(): Promise<ReviewEntity | null> {
		const sorted = [...this.items].sort((a, b) => {
			if (b.score !== a.score) {
				return b.score - a.score;
			}
			return b.createdAt.getTime() - a.createdAt.getTime();
		});

		return sorted[0] ?? null;
	}

	async findPaginated(params: {
		page: number;
		limit: number;
		excludeId?: string;
	}): Promise<{ items: ReviewEntity[]; total: number }> {
		const filtered = this.items
			.filter((review) => review.id !== params.excludeId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

		const total = filtered.length;
		const start = (params.page - 1) * params.limit;

		return { items: filtered.slice(start, start + params.limit), total };
	}
```

- [ ] **Step 3: Implement in the Prisma repository**

In `apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts`, add these two methods immediately after the existing `findAll` method (which ends around line 165):

```typescript
	async findFeatured(): Promise<ReviewEntity | null> {
		const review = await this.prisma.review.findFirst({
			include: reviewInclude,
			orderBy: [{ score: "desc" }, { createdAt: "desc" }],
		});

		if (!review) {
			return null;
		}

		return new ReviewEntity({
			...review,
			commentsCount: review._count.comments,
		});
	}

	async findPaginated(params: {
		page: number;
		limit: number;
		excludeId?: string;
	}): Promise<{ items: ReviewEntity[]; total: number }> {
		const where = params.excludeId ? { id: { not: params.excludeId } } : {};

		const [reviews, total] = await Promise.all([
			this.prisma.review.findMany({
				where,
				include: reviewInclude,
				orderBy: { createdAt: "desc" },
				skip: (params.page - 1) * params.limit,
				take: params.limit,
			}),
			this.prisma.review.count({ where }),
		]);

		const items = reviews.map(
			(review) =>
				new ReviewEntity({
					...review,
					commentsCount: review._count.comments,
				}),
		);

		return { items, total };
	}
```

- [ ] **Step 4: Verify it compiles**

Run: `cd apps/api && pnpm exec tsc --noEmit -p tsconfig.json`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/application/reviews/repositories apps/api/src/infra/database/prisma/repositories/prisma-reviews.repository.ts
git commit -m "feat(api): add featured and paginated review repository queries"
```

---

### Task 4: ListPublicReviewsUseCase + endpoint

**Files:**
- Create: `apps/api/src/application/reviews/use-cases/list-public-reviews.usecase.ts`
- Create: `apps/api/src/application/reviews/use-cases/list-public-reviews.usecase.spec.ts`
- Modify: `apps/api/src/infra/http/controllers/reviews/reviews.controller.ts`
- Modify: `apps/api/src/infra/http/controllers/reviews/reviews-http.module.ts`

**Interfaces:**
- Consumes: `findFeatured()`, `findPaginated(...)` (Task 3)
- Produces: `ListPublicReviewsUseCase.execute(params?: { page?: number; limit?: number }) => Promise<{ featured: ReviewResponseDto | null; items: ReviewResponseDto[]; meta: { page; limit; total; totalPages } }>`

- [ ] **Step 1: Write the failing use-case spec**

Create `apps/api/src/application/reviews/use-cases/list-public-reviews.usecase.spec.ts`:

```typescript
import { beforeEach, describe, expect, it } from "@jest/globals";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { ListPublicReviewsUseCase } from "./list-public-reviews.usecase";

function makeReview(id: string, score: number, day: number) {
	return new ReviewEntity({
		id,
		slug: `review-${id}`,
		title: `Review ${id}`,
		content: "Conteúdo",
		score,
		userId: "user-1",
		carVersionYearId: "cvy-1",
		status: "PUBLISHED" as never,
		pros: null,
		cons: null,
		kmDriven: null,
		createdAt: new Date(2024, 0, day),
		updatedAt: new Date(2024, 0, day),
		commentsCount: 0,
	});
}

describe("ListPublicReviewsUseCase", () => {
	let repository: InMemoryReviewsRepository;
	let sut: ListPublicReviewsUseCase;

	beforeEach(() => {
		repository = new InMemoryReviewsRepository();
		sut = new ListPublicReviewsUseCase(repository);
	});

	it("returns null featured and empty list when there are no reviews", async () => {
		const result = await sut.execute({ page: 1, limit: 12 });

		expect(result.featured).toBeNull();
		expect(result.items).toEqual([]);
		expect(result.meta).toEqual({ page: 1, limit: 12, total: 0, totalPages: 0 });
	});

	it("pins the top-scored review and excludes it from the list", async () => {
		repository.items.push(
			makeReview("low", 3, 1),
			makeReview("top", 9, 2),
			makeReview("mid", 5, 3),
		);

		const result = await sut.execute({ page: 1, limit: 12 });

		expect(result.featured?.id).toBe("top");
		expect(result.items.map((r) => r.id)).toEqual(["mid", "low"]);
		expect(result.meta).toEqual({ page: 1, limit: 12, total: 2, totalPages: 1 });
	});

	it("paginates the non-featured reviews", async () => {
		repository.items.push(makeReview("top", 9, 10));
		for (let i = 0; i < 5; i++) {
			repository.items.push(makeReview(`r${i}`, 1, i + 1));
		}

		const result = await sut.execute({ page: 2, limit: 2 });

		expect(result.featured?.id).toBe("top");
		expect(result.items).toHaveLength(2);
		expect(result.meta).toEqual({ page: 2, limit: 2, total: 5, totalPages: 3 });
	});
});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run: `cd apps/api && pnpm test -- --testPathPatterns=list-public-reviews.usecase`
Expected: FAIL with "Cannot find module './list-public-reviews.usecase'".

- [ ] **Step 3: Implement the use case**

Create `apps/api/src/application/reviews/use-cases/list-public-reviews.usecase.ts`:

```typescript
import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class ListPublicReviewsUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(params?: { page?: number; limit?: number }) {
		const page = params?.page ?? 1;
		const limit = params?.limit ?? 12;

		const featuredEntity = await this.reviewsRepository.findFeatured();
		const { items, total } = await this.reviewsRepository.findPaginated({
			page,
			limit,
			excludeId: featuredEntity?.id,
		});

		const featured = featuredEntity
			? ReviewsMapper.toReviewResponseDto(new ReviewEntity(featuredEntity))
			: null;

		return {
			featured,
			items: items.map((review) =>
				ReviewsMapper.toReviewResponseDto(new ReviewEntity(review)),
			),
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}
}
```

- [ ] **Step 4: Run the spec to verify it passes**

Run: `cd apps/api && pnpm test -- --testPathPatterns=list-public-reviews.usecase`
Expected: PASS (3 tests). If the `ReviewEntity` constructor fields in the spec's `makeReview` don't match the actual entity (e.g. a required field is missing), adjust `makeReview` to match `apps/api/src/application/reviews/entities/review.entity.ts` — the entity is the source of truth.

- [ ] **Step 5: Register the use case as a provider**

In `apps/api/src/infra/http/controllers/reviews/reviews-http.module.ts`, add the import and provider:

```typescript
import { ListPublicReviewsUseCase } from "src/application/reviews/use-cases/list-public-reviews.usecase";
```

Add `ListPublicReviewsUseCase,` to the `providers` array (next to `ListReviewsUseCase`).

- [ ] **Step 6: Add the controller endpoint**

In `apps/api/src/infra/http/controllers/reviews/reviews.controller.ts`:

Add the import near the other use-case imports:

```typescript
import { ListPublicReviewsUseCase } from "src/application/reviews/use-cases/list-public-reviews.usecase";
```

Add to the constructor parameter list (after `listReviewsService`):

```typescript
		private listPublicReviewsService: ListPublicReviewsUseCase,
```

Add this handler immediately after the existing `list` method (the `@Get()` block ending with `return res.status(HttpStatus.OK).json({ reviews });`):

```typescript
	@Get("public")
	@IsPublic()
	@ApiOperation({ description: "Listar reviews públicas paginadas" })
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "limit", required: false })
	@ApiOkResponse({ description: "Lista paginada de reviews com destaque" })
	async listPublic(
		@Query("page") pageParam: string,
		@Query("limit") limitParam: string,
		@Res() res: Response,
	) {
		const page = Number.parseInt(pageParam, 10);
		const limit = Number.parseInt(limitParam, 10);
		const { featured, items, meta } = await this.listPublicReviewsService.execute({
			page: Number.isInteger(page) && page > 0 ? page : undefined,
			limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
		});

		return res.status(HttpStatus.OK).json({ featured, reviews: items, meta });
	}
```

Note: `@Get("public")` must be declared **before** `@Get(":reviewId")` so `/reviews/public` is not captured by the `:reviewId` param route. Confirm ordering — `list` (`@Get()`), then `listPublic` (`@Get("public")`), then `findBySlug` (`@Get("slug/:slug")`), then `findById` (`@Get(":reviewId")`). If `:reviewId` appears earlier, move `listPublic` above it.

- [ ] **Step 7: Verify compile + full reviews suite**

Run: `cd apps/api && pnpm exec tsc --noEmit -p tsconfig.json && pnpm test -- --testPathPatterns=reviews`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/api/src/application/reviews/use-cases apps/api/src/infra/http/controllers/reviews
git commit -m "feat(api): add public paginated reviews endpoint with featured review"
```

---

### Task 5: Shared web PaginationControls component

**Files:**
- Create: `apps/web/components/PaginationControls.tsx`
- Modify: `apps/web/components/SearchResultsControls.tsx`

**Interfaces:**
- Produces: `PaginationControls({ page, totalPages }: { page: number; totalPages: number })` — a client component that renders "Anterior"/"Próximo" + `{page} de {totalPages}`, updates the `page` URL param, and renders `null` when `totalPages <= 1`.

- [ ] **Step 1: Create the PaginationControls component**

Create `apps/web/components/PaginationControls.tsx`:

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
	page: number;
	totalPages: number;
};

export function PaginationControls({ page, totalPages }: PaginationControlsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	if (totalPages <= 1) {
		return null;
	}

	function goToPage(next: number) {
		const params = new URLSearchParams(searchParams.toString());
		if (next > 1) params.set("page", String(next));
		else params.delete("page");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="flex items-center gap-2 text-sm">
			<button
				type="button"
				disabled={page <= 1}
				onClick={() => goToPage(page - 1)}
				className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Anterior
			</button>
			<span className="text-[var(--text-muted)]">
				{page} de {totalPages}
			</span>
			<button
				type="button"
				disabled={page >= totalPages}
				onClick={() => goToPage(page + 1)}
				className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				Próximo
			</button>
		</div>
	);
}
```

- [ ] **Step 2: Refactor SearchResultsControls to reuse it**

Replace the whole `apps/web/components/SearchResultsControls.tsx` with:

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SearchSort } from "@/api/search";
import { PaginationControls } from "./PaginationControls";

type SearchResultsControlsProps = {
	sort: SearchSort;
	page: number;
	totalPages: number;
};

export function SearchResultsControls({ sort, page, totalPages }: SearchResultsControlsProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	function changeSort(nextSort: SearchSort) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", nextSort);
		params.delete("page");
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
			<label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
				Ordenar por
				<select
					value={sort}
					onChange={(event) => changeSort(event.target.value as SearchSort)}
					className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[var(--text)]"
				>
					<option value="relevance">Relevância</option>
					<option value="recent">Mais recentes</option>
					<option value="popular">Mais populares</option>
				</select>
			</label>

			<PaginationControls page={page} totalPages={totalPages} />
		</div>
	);
}
```

- [ ] **Step 3: Verify web compiles**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/PaginationControls.tsx apps/web/components/SearchResultsControls.tsx
git commit -m "feat(web): extract reusable PaginationControls component"
```

---

### Task 6: Forum page pagination wiring

**Files:**
- Modify: `apps/web/api/forum.ts`
- Modify: `apps/web/app/forum/page.tsx`
- Modify: `apps/web/app/forum/forum-page.tsx`

**Interfaces:**
- Consumes: `GET /forum/topics?page=&limit=30` → `{ topics, meta }`; `PaginationControls` (Task 5).
- Produces: `fetchForumTopicsPage(params: { page: number; limit?: number }): Promise<{ items: ForumTopicSummary[]; meta: PaginationMeta }>`

- [ ] **Step 1: Add the paginated fetcher**

In `apps/web/api/forum.ts`, add near the top after the existing type declarations:

```typescript
export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

type ForumTopicsPageResponse = {
	topics?: ApiForumTopic[];
	meta?: PaginationMeta;
};
```

Then add this exported function after the existing `fetchForumTopics`:

```typescript
export async function fetchForumTopicsPage(params: {
	page: number;
	limit?: number;
}): Promise<{ items: ForumTopicSummary[]; meta: PaginationMeta }> {
	const limit = params.limit ?? 30;
	const emptyMeta: PaginationMeta = { page: 1, limit, total: 0, totalPages: 0 };

	try {
		const searchParams = new URLSearchParams({
			page: String(params.page),
			limit: String(limit),
		});
		const response = await fetch(
			`${API_BASE_URL}/forum/topics?${searchParams.toString()}`,
			{ cache: "no-store" },
		);

		if (!response.ok) {
			return { items: [], meta: emptyMeta };
		}

		const data = (await response.json()) as ForumTopicsPageResponse;

		return {
			items: (data.topics ?? []).map(toForumTopicSummary),
			meta: data.meta ?? emptyMeta,
		};
	} catch {
		return { items: [], meta: emptyMeta };
	}
}
```

- [ ] **Step 2: Wire the forum route page**

In `apps/web/app/forum/page.tsx`:

Change the import line:

```typescript
import { fetchForumTopics, fetchForumTopicsPage } from "@/api/forum";
```

Replace the `threads` derivation and the `<ForumPage />` props. Replace this block:

```typescript
	const searchResult = query
		? await fetchTopicSearch({ q: query, sort, page })
		: null;
	const threads = searchResult?.items ?? (await fetchForumTopics());
```

with:

```typescript
	const searchResult = query
		? await fetchTopicSearch({ q: query, sort, page })
		: null;
	const listing = query ? null : await fetchForumTopicsPage({ page, limit: 30 });
	const threads = searchResult?.items ?? listing?.items ?? [];
```

Note: `fetchForumTopics` is no longer used directly in this file after this change, but is still exported for the homepage — the unused import will fail the web typecheck/lint's `noUnusedLocals` if enabled. Keep only what you use: change the import to `import { fetchForumTopicsPage } from "@/api/forum";` and remove `fetchForumTopics` from it.

Replace the `<ForumPage ... />` element's props to pass listing meta when not searching:

```tsx
				<ForumPage
					data={{ threads }}
					query={query}
					total={searchResult?.meta.total ?? listing?.meta.total}
					sort={sort}
					page={searchResult?.meta.page ?? listing?.meta.page}
					totalPages={searchResult?.meta.totalPages ?? listing?.meta.totalPages}
				/>
```

- [ ] **Step 3: Render PaginationControls in ForumPage for the default listing**

In `apps/web/app/forum/forum-page.tsx`:

Add the import:

```typescript
import { PaginationControls } from "@/components/PaginationControls";
```

Replace the controls block (currently `{query ? (<SearchResultsControls .../>) : null}`) with:

```tsx
					{query ? (
						<SearchResultsControls
							sort={sort}
							page={page ?? 1}
							totalPages={totalPages ?? 0}
						/>
					) : (
						<div className="mb-6 flex justify-end">
							<PaginationControls page={page ?? 1} totalPages={totalPages ?? 0} />
						</div>
					)}
```

- [ ] **Step 4: Verify web compiles**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Manual smoke check**

Start the stack (`docker compose up -d` then `pnpm dev --filter=api` and `pnpm dev --filter=web`). Visit `http://localhost:3001/forum`. Confirm: at most 30 topics render; if more than 30 exist, "Anterior"/"Próximo" appear and navigate (URL gains `?page=2`); page 1 shows "Anterior" disabled. If fewer than 31 topics exist, no controls appear (expected — `totalPages <= 1`).

- [ ] **Step 6: Commit**

```bash
git add apps/web/api/forum.ts apps/web/app/forum/page.tsx apps/web/app/forum/forum-page.tsx
git commit -m "feat(web): paginate forum topics listing"
```

---

### Task 7: Reviews page pagination wiring

**Files:**
- Modify: `apps/web/api/reviews.ts`
- Modify: `apps/web/app/reviews/page.tsx`

**Interfaces:**
- Consumes: `GET /reviews/public?page=&limit=12` → `{ featured, reviews, meta }`; `PaginationControls` (Task 5); `PaginationMeta` (Task 6).
- Produces: `fetchPublicReviewsPage(params: { page: number; limit?: number }): Promise<{ featured: PublicReview | null; items: PublicReview[]; meta: PaginationMeta }>`

- [ ] **Step 1: Add the paginated fetcher**

In `apps/web/api/reviews.ts`:

Add the import for the shared meta type near the top imports:

```typescript
import type { PaginationMeta } from "@/api/forum";
```

Add a response type near the other `type ...Response` declarations:

```typescript
type PublicReviewsPageResponse = {
	featured?: ApiReview | null;
	reviews?: ApiReview[];
	meta?: PaginationMeta;
};
```

Add this exported function after the existing `fetchPublicReviews`:

```typescript
export async function fetchPublicReviewsPage(params: {
	page: number;
	limit?: number;
}): Promise<{
	featured: PublicReview | null;
	items: PublicReview[];
	meta: PaginationMeta;
}> {
	const limit = params.limit ?? 12;
	const emptyMeta: PaginationMeta = { page: 1, limit, total: 0, totalPages: 0 };

	try {
		const searchParams = new URLSearchParams({
			page: String(params.page),
			limit: String(limit),
		});
		const response = await fetch(
			`${API_BASE_URL}/reviews/public?${searchParams.toString()}`,
			{ cache: "no-store" },
		);

		if (!response.ok) {
			return { featured: null, items: [], meta: emptyMeta };
		}

		const data = (await response.json()) as PublicReviewsPageResponse;

		return {
			featured: data.featured ? toPublicReview(data.featured) : null,
			items: (data.reviews ?? []).map(toPublicReview),
			meta: data.meta ?? emptyMeta,
		};
	} catch {
		return { featured: null, items: [], meta: emptyMeta };
	}
}
```

- [ ] **Step 2: Wire the reviews route page**

In `apps/web/app/reviews/page.tsx`:

Change the import:

```typescript
import { fetchPublicReviewsPage } from "@/api/reviews";
```

Add the import for the controls:

```typescript
import { PaginationControls } from "@/components/PaginationControls";
```

Replace the data-derivation block. Replace:

```typescript
	const searchResult = isSearching
		? await fetchReviewSearch({ q: query, sort, page })
		: null;
	const reviews = searchResult?.items ?? (await fetchPublicReviews());
	const total = searchResult?.meta.total ?? reviews.length;
	const featured = isSearching
		? undefined
		: [...reviews].sort((a, b) => b.score - a.score)[0];
	const listedReviews = isSearching
		? reviews
		: reviews.filter((review) => review.id !== featured?.id);
	const items = listedReviews.map((review) => ({ review }));
```

with:

```typescript
	const searchResult = isSearching
		? await fetchReviewSearch({ q: query, sort, page })
		: null;
	const listing = isSearching
		? null
		: await fetchPublicReviewsPage({ page, limit: 12 });
	const reviews = searchResult?.items ?? listing?.items ?? [];
	const total = searchResult?.meta.total ?? listing?.meta.total ?? 0;
	const featured = isSearching ? undefined : (listing?.featured ?? undefined);
	const items = reviews.map((review) => ({ review }));
```

- [ ] **Step 3: Render PaginationControls for the default listing**

Still in `apps/web/app/reviews/page.tsx`, below the `ReviewsFilter`/empty-state block, add pagination for the non-search case. Find the closing of the list `{items.length > 0 ? (...) : ...}` expression and add immediately after it (inside the same `<div className="max-w-[1100px] ...">`):

```tsx
					{!isSearching && listing && listing.meta.totalPages > 1 ? (
						<div className="mt-8 flex justify-end">
							<PaginationControls
								page={listing.meta.page}
								totalPages={listing.meta.totalPages}
							/>
						</div>
					) : null}
```

Note: the empty-state condition `reviews.length === 0` still works since `reviews` now comes from `listing?.items`. The featured banner render (`{featured && (...)}`) is unchanged and now shows on every page because `listing.featured` is the same top-scored review regardless of `page`.

- [ ] **Step 4: Verify web compiles**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Manual smoke check**

Visit `http://localhost:3001/reviews`. Confirm: featured banner shows the top-scored review; the list shows at most 12 reviews and excludes the featured one; if more than 13 reviews exist, "Anterior"/"Próximo" appear; navigating to page 2 keeps the same featured banner and shows the next 12 non-featured reviews (`?page=2` in URL). Search (type a query) still shows the sort dropdown + pagination via `SearchResultsControls`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/api/reviews.ts apps/web/app/reviews/page.tsx
git commit -m "feat(web): paginate reviews listing with pinned featured review"
```

---

### Task 8: Full verification

- [ ] **Step 1: API typecheck + tests**

Run: `cd apps/api && pnpm exec tsc --noEmit -p tsconfig.json && pnpm test`
Expected: PASS (all suites green).

- [ ] **Step 2: Web typecheck + lint**

Run: `cd apps/web && pnpm exec tsc --noEmit && cd /Users/nathanbaldez/Documents/papoauto && pnpm lint`
Expected: PASS.

- [ ] **Step 3: Build**

Run: `cd /Users/nathanbaldez/Documents/papoauto && pnpm build`
Expected: PASS.
