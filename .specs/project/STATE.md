# State

## Last Task

**2026-04-17** — Converted all domain mappers (brands, models, versions, comments, reviews, votes) to the class pattern matching `UsersMapper`, updated all use-case and spec callers, fixed `create-user.usecase.spec.ts` import path (`@infra` → `src/infra`), and adjusted `FakeHashProvider.hash` to append `-hashed` so tests can distinguish hashed from raw passwords while `compare` stays consistent.

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-13 | Renamed `application/` to `domain/` | Better reflects Clean Architecture terminology |
| 2026-04-13 | Entities use `Partial<Entity>` + `Object.assign` pattern | Simpler than explicit property initialization |
| 2026-04-17 | Mappers are classes with static methods (e.g. `UsersMapper.toUserResponseDto`) | Supersedes the 2026-04-13 function-based decision; unified pattern across all domains |
| 2026-04-17 | `FakeHashProvider.hash` appends `-hashed` suffix | Allows tests to assert stored hash differs from raw password while keeping `compare` deterministic |

## Blockers

None currently.

## Lessons Learned

- Build `@repo/jest-config` before running tests for the first time
- Use `--testPathPatterns` (plural) not `--testPathPattern` for Jest 30

## Preferences

- No `readonly` on constructor-injected dependencies
- No Co-Authored-By or heredoc in git commits
- Always remove unused imports after edits

## Deferred Ideas

- Email confirmation on registration (controller message claims it but no service exists)
- Per-domain NestJS modules (currently all in one HttpModule)
- Shared `@repo/api` package cleanup (contains unrelated Link scaffolding)
