# Stack

## Runtime & Language

- **Node.js** ≥18
- **TypeScript** 5.5.4
- **Package manager**: pnpm 8.15.5
- **Monorepo**: Turborepo 2.8.17

## API (apps/api)

- **Framework**: NestJS 11.1.11
- **ORM**: Prisma 7.5.0 with `@prisma/adapter-pg`
- **Database**: PostgreSQL 16 (Docker)
- **Auth**: Passport 0.7 + passport-jwt 4.0.1 + @nestjs/jwt 11.0.2
- **Validation**: class-validator 0.15.1 + class-transformer 0.5.1
- **Password hashing**: bcrypt 6.0.0
- **API docs**: @nestjs/swagger 11.2.6 (available at `/api/docs`)
- **Config**: @nestjs/config 4.0.3 + dotenv 17.3.1

## Web (apps/web)

- **Framework**: Next.js (App Router)
- **Status**: Scaffolding only — `layout.tsx` and `page.tsx`

## Shared Packages

- `@repo/ui` — React components (Button, Card, Code)
- `@repo/api` — Shared NestJS types (currently Link entity/DTOs — likely leftover from scaffolding)
- `@repo/jest-config` — Jest configs for nest and next
- `@repo/typescript-config` — Shared tsconfig bases
- `@repo/eslint-config` — Shared ESLint config

## Testing

- **Jest** 30.2.0 with ts-jest 29.4.6
- **E2E**: supertest 7.2.2
- **NestJS testing**: @nestjs/testing 11.1.11

## Linting & Formatting

- **ESLint** 9.39.2
- **Biome** 2.4.8 (installed but unclear if primary)
- **Prettier** 3.2.5 (root-level formatting)

## Infrastructure

- **Docker Compose**: PostgreSQL 16-alpine container (`reviewdecarro_db`)
- **CI/CD**: None observed
