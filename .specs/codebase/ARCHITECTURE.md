# Architecture

## Overview

Turborepo monorepo with Clean Architecture in the API layer. The web frontend is scaffolding-only.

```
┌─────────────────────────────────────────────────────┐
│                    Turborepo                        │
├─────────────┬─────────────┬─────────────────────────┤
│  apps/api   │  apps/web   │  packages/*             │
│  (NestJS)   │  (Next.js)  │  (shared configs/types) │
└─────────────┴─────────────┴─────────────────────────┘
```

## API Clean Architecture Layers

```
┌──────────────────────────────────────────────┐
│              infra/http (Controllers)         │  ← HTTP adapter
├──────────────────────────────────────────────┤
│              infra/auth (Guards/JWT)          │  ← Auth adapter
├──────────────────────────────────────────────┤
│              domain/* (Use Cases/Entities)    │  ← Business logic
├──────────────────────────────────────────────┤
│              infra/database (Prisma repos)    │  ← Data adapter
└──────────────────────────────────────────────┘
```

### Dependency Flow
- Controllers → Use Cases → Repository abstractions (domain layer)
- Prisma implementations (infra) → injected into abstract repositories via NestJS DI
- Use cases throw domain errors (`BadRequestError`) → global interceptor maps to HTTP exceptions

### Module Wiring
- `AppModule` imports `ConfigModule` (global) + `HttpModule`
- `HttpModule` imports `DatabaseModule` + `AuthModule`, registers all controllers and use-case providers
- `DatabaseModule` provides `PrismaService` and binds abstract repos to Prisma implementations
- `AuthModule` provides `JwtService`, `AuthService`, `JwtStrategy`, and `JwtAuthGuard` (global)

### Auth Flow
1. All routes protected by default via global `JwtAuthGuard`
2. Public routes marked with `@IsPublic()` decorator
3. JWT token validated → `JwtStrategy.validate()` fetches full user from DB
4. Authenticated user available via `@LoggedInUser()` param decorator

### Request Pipeline
```
Request → ValidationPipe (global) → JwtAuthGuard (global) → Controller → UseCase → Repository → DB
                                                                                          ↓
Response ← BadRequestInterceptor (global) ← Controller ← UseCase (throws BadRequestError)
```

## Domain Boundaries

Five domains defined in Prisma schema, one implemented:

| Domain   | Models                      | Status        |
|----------|-----------------------------|---------------|
| Users    | User, Role                  | Implemented   |
| Cars     | Brand, Model, CarVersion    | Schema only   |
| Reviews  | Review, ReviewRating        | Schema only   |
| Comments | Comment                     | Schema only   |
| Votes    | ReviewVote                  | Schema only   |

Empty domain directories exist for cars, reviews, comments, votes — ready for implementation.
