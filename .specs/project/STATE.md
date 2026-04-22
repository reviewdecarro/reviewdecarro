# State

## Last Task

**2026-04-20** — Cleaned up `@repo/api` shared package: removed the Turborepo `links/` scaffolding (`Link` entity + `CreateLinkDto`/`UpdateLinkDto`), reduced `entry.ts` to `export {}` to keep the package as a placeholder for future shared types, dropped the unused `@repo/api` dep from `apps/api/package.json`, removed the `Link` import + `getLinks` fetch + links-render block from `apps/web/app/page.tsx`, and removed `@repo/api` from `apps/web/package.json` devDependencies.

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-13 | Renamed `application/` to `domain/` | Better reflects Clean Architecture terminology |
| 2026-04-13 | Entities use `Partial<Entity>` + `Object.assign` pattern | Simpler than explicit property initialization |
| 2026-04-17 | Mappers are classes with static methods (e.g. `UsersMapper.toUserResponseDto`) | Supersedes the 2026-04-13 function-based decision; unified pattern across all domains |
| 2026-04-17 | `FakeHashProvider.hash` appends `-hashed` suffix | Allows tests to assert stored hash differs from raw password while keeping `compare` deterministic |
| 2026-04-20 | One HTTP module per domain, named `<Domain>HttpModule` in `<domain>-http.module.ts` | Supersedes the single `HttpModule` setup; each domain owns its controller, use cases, and required infra imports |

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
