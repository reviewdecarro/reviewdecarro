# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root unless noted. The API runs on port 3000, the web on port 3001.

```bash
# Run everything
pnpm dev

# Run a single app
pnpm dev --filter=api
pnpm dev --filter=web

# Build
pnpm build

# Lint
pnpm lint

# Tests (from apps/api)
pnpm test                        # unit tests
pnpm test:e2e                    # e2e tests
pnpm test -- --testPathPatterns=users  # single test file

# Database (from apps/api)
pnpm dlx prisma migrate dev --name <name>
pnpm dlx prisma generate
```

Start the database before running the API:
```bash
docker compose up -d
```

## Architecture

This is a **Turborepo monorepo** with two apps and shared packages:

- `apps/api` — NestJS REST API (port 3000)
- `apps/web` — Next.js frontend (port 3001)
- `packages/ui` — Shared React component library (`@repo/ui`)
- `packages/api` — Shared NestJS types/resources (`@repo/api`)
- `packages/typescript-config` — Shared TS configs
- `packages/jest-config` — Shared Jest configs

## API Structure (`apps/api/src`)

The API follows **Clean Architecture** with three layers:

### `domain/`
Domain logic, organized per domain: `users`, `cars`, `reviews`, `comments`, `votes`.

Each domain contains:
- `entities/` — Domain entity classes implementing the Prisma model type
- `repositories/` — Abstract repository classes (interfaces for data access)
- `use-cases/` — Business logic classes, one per operation
- `dtos/` — Input/output shapes
- `mappers/` — Functions that convert entities to response DTOs using `plainToInstance`

### `infra/`
Adapters and infrastructure:
- `http/` — NestJS HTTP adapter. `http.module.ts` imports all use cases as providers and registers all controllers. Controllers live in `http/controllers/<domain>/`.
- `auth/` — Authentication: guards, Passport strategies, types, `auth.module.ts`, `auth.service.ts`.

### `shared/`
Cross-cutting concerns:
- `errors/types/` — Custom error classes (e.g. `BadRequestError extends Error`)
- `errors/interceptors/` — `BadRequestInterceptor` catches `BadRequestError` and converts it to NestJS `BadRequestException`. Registered globally in `main.ts`.

## Key Conventions

- **Entities** are classes that `implement` their Prisma model type (from `prisma/generated/models/`). Constructor takes `Partial<Entity>` and uses `Object.assign(this, partial)`. Properties use `class-transformer` decorators (`@Expose()`, `@Exclude()`) to control serialization.
- **Repositories** are `abstract class` in the domain layer. Prisma implementations live in `infra/database/` and are injected via NestJS DI.
- **Mappers** are standalone functions (not classes) that use `plainToInstance` with `excludeExtraneousValues: true` to convert entities to response DTOs.
- **Errors** thrown from use cases use `BadRequestError` (or other shared error types). The global interceptor maps them to the correct HTTP response.
- **Prisma client** is generated to `prisma/generated/` (via `output = "./generated"` in schema.prisma). Import model types from `prisma/generated/models/<ModelName>` (e.g. `UserModel` from `prisma/generated/models/User`). The `schema=public` query param in `DATABASE_URL` allows switching schemas for tests.
- **DTOs** are classes with `class-validator` decorators (e.g. `@IsString()`, `@IsNotEmpty()`). `strictPropertyInitialization` is disabled in `tsconfig.json` so DTO properties don't need definite assignment (`!`).
- **Validation** is handled globally via `ValidationPipe` in `main.ts` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`. Unknown properties are stripped and invalid requests return 400.
- **Git commits** use conventional commit format (`feat:`, `chore:`, `refactor:`, etc.) with plain `-m` strings — no heredoc, no Co-Authored-By.

## Testing

Jest 30 with `ts-jest`. Config shared via `packages/jest-config`.

- Test files use `*.spec.ts` suffix and live next to the source file.
- Import test functions from `@jest/globals`: `import { describe, it, expect, jest, beforeEach } from "@jest/globals";`
- Use `--testPathPatterns` (not `--testPathPattern`) to filter tests.
- Build `@repo/jest-config` before running tests for the first time: `pnpm build --filter=@repo/jest-config`.
- Mock repositories using `jest.Mocked<RepositoryProps>` with `jest.fn()` for each method.

## Database

PostgreSQL via Docker Compose. Prisma 7 with `@prisma/adapter-pg`.

- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/`
- Config: `apps/api/prisma.config.ts` (uses `env()` from `prisma/config` + `dotenv/config`)
- Env: `apps/api/.env` (gitignored); see `apps/api/.env.development` for the expected shape
