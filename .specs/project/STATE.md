# State

## Decisions

| Date | Decision | Context |
|------|----------|---------|
| 2026-04-13 | Renamed `application/` to `domain/` | Better reflects Clean Architecture terminology |
| 2026-04-13 | Entities use `Partial<Entity>` + `Object.assign` pattern | Simpler than explicit property initialization |
| 2026-04-13 | Mappers are standalone functions, not classes | Lighter than class-based mappers, uses `plainToInstance` |

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
