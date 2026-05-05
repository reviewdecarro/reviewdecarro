# State

## Last Task

**2026-04-23** — Added URL slug to reviews. New `slug String @unique` field on `Review` (schema + migration `add_review_slug`). Created `shared/utils/slugify.ts` (NFD-normalize, strip diacritics, lowercase, hyphenate). `CreateReviewUseCase` derives slug from `title` at creation time, retries with `-2`, `-3`, ... on collision via new `ReviewsRepositoryProps.findBySlug`; slug is frozen on update. `ReviewsRepositoryProps.create` signature changed to `(userId, slug, data)` with both in-memory and Prisma implementations updated. New `GetReviewBySlugUseCase` exposed via public `GET /reviews/slug/:slug` (registered before `:reviewId` to avoid path conflict). `ReviewEntity` and `ReviewResponseDto` expose `slug`. Tests cover slug derivation, collision suffixing, and lookup-by-slug.

## Decisions

| Date       | Decision                                                                                                                  | Context                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-13 | Renamed `application/` to `application/`                                                                                  | Better reflects Clean Architecture terminology                                                                                      |
| 2026-04-13 | Entities use `Partial<Entity>` + `Object.assign` pattern                                                                  | Simpler than explicit property initialization                                                                                       |
| 2026-04-17 | Mappers are classes with static methods (e.g. `UsersMapper.toUserResponseDto`)                                            | Supersedes the 2026-04-13 function-based decision; unified pattern across all applications                                          |
| 2026-04-17 | `FakeHashProvider.hash` appends `-hashed` suffix                                                                          | Allows tests to assert stored hash differs from raw password while keeping `compare` deterministic                                  |
| 2026-04-20 | One HTTP module per application, named `<application>HttpModule` in `<application>-http.module.ts`                        | Supersedes the single `HttpModule` setup; each application owns its controller, use cases, and required infra imports               |
| 2026-04-23 | Review slugs derived server-side from `title`, globally `@unique`, frozen on update, collision-suffixed (`-2`, `-3`, ...) | URL-friendly identifier for the frontend; freezing avoids breaking shared links when titles change                                  |
| 2026-04-23 | Server-generated fields are passed to repositories as explicit parameters, not folded into the create DTO                 | Keeps DTOs as pure inbound contracts (validated client input); applied first to `ReviewsRepositoryProps.create(userId, slug, data)` |

## Blockers

None currently.

## Lessons Learned

- Build `@repo/jest-config` before running tests for the first time
- Use `--testPathPatterns` (plural) not `--testPathPattern` for Jest 30

## Preferences

- No `readonly` on constructor-injected dependencies
- No Co-Authored-By or heredoc in git commits
- Always remove unused imports after edits
- Work directly on `development` — no per-task feature branches

## Deferred Ideas

- Email confirmation on registration (controller message claims it but no service exists)
- Restore staging branch protection workflow (currently bypassing PR + `Lint, Build & Test` check when pushing merges)
- Backfill slugs for any pre-existing reviews if data was kept across the migration (current migration assumes a reset or empty `reviews` table)
