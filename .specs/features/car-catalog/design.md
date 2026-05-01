# Car Catalog Design

**Spec**: `.specs/features/car-catalog/spec.md`
**Status**: Draft

---

## Architecture Overview

The car catalog follows the same Clean Architecture pattern as the users application. New additions: a `Slug` value object in the shared layer and an `AdminOnly` guard in the auth layer.

```
                    ┌──────────────────────────────┐
                    │         Controllers           │
                    │  BrandsController             │
                    │  ModelsController             │
                    │  CarVersionsController        │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
                    │         Use Cases             │
                    │  Create/Update/Delete/         │
                    │  List/FindBySlug per entity   │
                    └──────────┬───────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼──────┐ ┌───────▼───────┐
    │ BrandsRepo     │ │ ModelsRepo  │ │ CarVersions   │
    │ (abstract)     │ │ (abstract)  │ │ Repo(abstract)│
    └─────────┬──────┘ └──────┬──────┘ └───────┬───────┘
              │                │                │
    ┌─────────▼──────┐ ┌──────▼──────┐ ┌───────▼───────┐
    │ PrismaBrands   │ │ PrismaModels│ │ PrismaCarVer  │
    │ Repository     │ │ Repository  │ │ Repository    │
    └────────────────┘ └─────────────┘ └───────────────┘
```

### Cross-Cutting Additions

```
shared/
├── decorators/
│   └── admin-only.decorator.ts      # @AdminOnly() metadata
├── guards/
│   └── roles.guard.ts               # RolesGuard — checks ADMIN role
└── value-objects/
    └── slug.ts                       # Slug.create(name) value object
```

### Auth Flow Change

The `JwtStrategy.validate()` currently returns a `UserEntity` without roles. For the admin guard to work, the user returned from JWT validation needs roles. Two options:

1. **Modify `findById` to include roles** — changes existing behavior
2. **Create a separate `findByIdWithRoles` method** — keeps existing method unchanged

**Decision**: Option 1 — modify `findById` in the repository to always include roles. Roles are small (1-2 records per user) and always needed for authorization. The `UserEntity` gains a `roles` property with `@Expose()`.

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component | Location | How to Use |
|-----------|----------|------------|
| UserEntity pattern | `application/users/entities/user.entity.ts` | Same `Partial<T>` + `Object.assign` + class-transformer pattern |
| UsersRepositoryProps pattern | `application/users/repositories/users.repository.ts` | Same abstract class pattern for 3 new repos |
| PrismaUsersRepository pattern | `infra/database/prisma/repositories/prisma-users.repository.ts` | Same Prisma implementation pattern |
| toUserResponseDto pattern | `application/users/mappers/user.mapper.ts` | Same `plainToInstance` mapper pattern |
| CreateUserDto pattern | `application/users/dtos/create-user.dto.ts` | Same class-validator DTO pattern |
| UsersController pattern | `infra/http/controllers/users/users.controller.ts` | Same controller + Swagger + @IsPublic pattern |
| @IsPublic decorator | `shared/decorators/is-public.decorator.ts` | Reuse as-is for GET endpoints |
| JwtAuthGuard | `infra/auth/guards/jwt-auth.guard.ts` | Reference pattern for RolesGuard |
| BadRequestError | `shared/errors/types/bad-request-error.ts` | Reuse for business rule violations |
| DatabaseModule | `infra/database/database.module.ts` | Add 3 new repo bindings |
| HttpModule | `infra/http/http.module.ts` | Add 3 new controllers + use-case providers |

### New Error Type Needed

| Error | HTTP Status | Use |
|-------|-------------|-----|
| NotFoundError | 404 | Entity not found by slug/id |

`BadRequestError` (400) is wrong for "not found" — we need a `NotFoundError` with a corresponding `NotFoundInterceptor`, following the same pattern as `BadRequestError` + `BadRequestInterceptor`.

---

## Components

### Slug Value Object

- **Purpose**: Generate URL-safe slugs from names, handling accents and special characters
- **Location**: `src/shared/value-objects/slug.ts`
- **Interfaces**:
  - `Slug.create(name: string): string` — static method, generates slug from name
  - `Slug.createForCarVersion(year: number, versionName: string): string` — static, composite slug
- **Dependencies**: None (pure function, no external libs — use native `normalize('NFD')` for accent stripping)
- **Reuses**: Nothing — new shared utility

### NotFoundError + Interceptor

- **Purpose**: Map "not found" application errors to 404 HTTP responses
- **Location**: `src/shared/errors/types/not-found-error.ts`, `src/shared/errors/interceptors/not-found.interceptor.ts`
- **Interfaces**: Same pattern as `BadRequestError` / `BadRequestInterceptor`
- **Dependencies**: `@nestjs/common`
- **Reuses**: `BadRequestError` pattern exactly

### AdminOnly Decorator + RolesGuard

- **Purpose**: Restrict endpoints to admin users
- **Location**: `src/shared/decorators/admin-only.decorator.ts`, `src/shared/guards/roles.guard.ts`
- **Interfaces**:
  - `@AdminOnly()` — sets metadata `roles: [RoleType.ADMIN]`
  - `RolesGuard` — reads metadata, checks `request.user.roles` for matching type
- **Dependencies**: `@nestjs/common`, `Reflector`, `RoleType` enum from Prisma
- **Reuses**: `@IsPublic()` pattern for the decorator, `JwtAuthGuard` pattern for the guard

### RoleEntity

- **Purpose**: application entity for user roles
- **Location**: `src/application/users/entities/role.entity.ts`
- **Interfaces**: `implements RoleModel` — id, type, userId
- **Dependencies**: `RoleModel` from `prisma/generated/models/Role`
- **Reuses**: `UserEntity` pattern

### UserEntity Update

- **Purpose**: Add `roles` relation to existing UserEntity
- **Location**: `src/application/users/entities/user.entity.ts`
- **Change**: Add `@Expose() roles?: RoleEntity[]` property

---

### BrandEntity

- **Purpose**: application entity for car brands
- **Location**: `src/application/cars/entities/brand.entity.ts`
- **Interfaces**: `implements BrandModel` — id, name, slug, createdAt
- **Dependencies**: `BrandModel` from `prisma/generated/models/Brand`
- **Reuses**: `UserEntity` pattern

### ModelEntity

- **Purpose**: application entity for car models
- **Location**: `src/application/cars/entities/model.entity.ts`
- **Interfaces**: `implements ModelModel` — id, name, slug, brandId, createdAt
- **Dependencies**: `ModelModel` from `prisma/generated/models/Model`
- **Reuses**: `UserEntity` pattern

### CarVersionEntity

- **Purpose**: application entity for car versions
- **Location**: `src/application/cars/entities/car-version.entity.ts`
- **Interfaces**: `implements CarVersionModel` — id, modelId, year, versionName, engine, transmission, slug, createdAt
- **Dependencies**: `CarVersionModel` from `prisma/generated/models/CarVersion`
- **Reuses**: `UserEntity` pattern

---

### BrandsRepositoryProps

- **Purpose**: Abstract repository for brand data access
- **Location**: `src/application/cars/repositories/brands.repository.ts`
- **Interfaces**:
  - `create(data: CreateBrandDto): Promise<BrandEntity>`
  - `findAll(): Promise<BrandEntity[]>`
  - `findBySlug(slug: string): Promise<BrandEntity | null>`
  - `findBySlugWithModels(slug: string): Promise<BrandEntity | null>` — includes models relation
  - `update(id: string, data: UpdateBrandDto): Promise<BrandEntity>`
  - `delete(id: string): Promise<void>`
  - `hasModels(id: string): Promise<boolean>` — for orphan check
- **Reuses**: `UsersRepositoryProps` pattern

### ModelsRepositoryProps

- **Purpose**: Abstract repository for model data access
- **Location**: `src/application/cars/repositories/models.repository.ts`
- **Interfaces**:
  - `create(data: CreateModelDto): Promise<ModelEntity>`
  - `findAllByBrand(brandId: string): Promise<ModelEntity[]>`
  - `findByBrandSlugAndModelSlug(brandSlug: string, modelSlug: string): Promise<ModelEntity | null>` — includes carVersions
  - `findById(id: string): Promise<ModelEntity | null>`
  - `findByBrandIdAndSlug(brandId: string, slug: string): Promise<ModelEntity | null>` — for uniqueness check
  - `update(id: string, data: UpdateModelDto): Promise<ModelEntity>`
  - `delete(id: string): Promise<void>`
  - `hasCarVersions(id: string): Promise<boolean>`
- **Reuses**: `UsersRepositoryProps` pattern

### CarVersionsRepositoryProps

- **Purpose**: Abstract repository for car version data access
- **Location**: `src/application/cars/repositories/car-versions.repository.ts`
- **Interfaces**:
  - `create(data: CreateCarVersionDto): Promise<CarVersionEntity>`
  - `findAllByModel(modelId: string): Promise<CarVersionEntity[]>`
  - `findBySlug(slug: string): Promise<CarVersionEntity | null>`
  - `findById(id: string): Promise<CarVersionEntity | null>`
  - `update(id: string, data: UpdateCarVersionDto): Promise<CarVersionEntity>`
  - `delete(id: string): Promise<void>`
  - `hasReviews(id: string): Promise<boolean>`
- **Reuses**: `UsersRepositoryProps` pattern

---

### DTOs

**Brand:**
- `CreateBrandDto` — `name: string` (@IsString, @IsNotEmpty)
- `UpdateBrandDto` — `name?: string` (@IsString, @IsOptional)
- `BrandResponseDto` — id, name, slug, createdAt (@Expose)

**Model:**
- `CreateModelDto` — `name: string`, `brandId: string` (@IsString, @IsNotEmpty, @IsUUID)
- `UpdateModelDto` — `name?: string` (@IsString, @IsOptional)
- `ModelResponseDto` — id, name, slug, brandId, createdAt (@Expose)

**CarVersion:**
- `CreateCarVersionDto` — `modelId: string`, `year: number`, `versionName: string`, `engine?: string`, `transmission?: string`
- `UpdateCarVersionDto` — `year?: number`, `versionName?: string`, `engine?: string`, `transmission?: string` (all @IsOptional)
- `CarVersionResponseDto` — all fields (@Expose)

---

### Use Cases (15 total: 5 per entity)

Each follows the `CreateUserUseCase` pattern: `@Injectable()`, single `execute()` method, throws application errors.

**Brands (5):**
- `CreateBrandUseCase` — validates no duplicate slug, calls `Slug.create()`, creates brand
- `ListBrandsUseCase` — returns all brands
- `FindBrandBySlugUseCase` — finds by slug with models, throws NotFoundError
- `UpdateBrandUseCase` — finds by id, validates new slug uniqueness if name changed, updates
- `DeleteBrandUseCase` — checks hasModels, throws BadRequestError if children exist, deletes

**Models (5):**
- `CreateModelUseCase` — validates brand exists, validates no duplicate slug within brand, creates
- `ListModelsByBrandUseCase` — finds brand by slug, returns its models
- `FindModelBySlugUseCase` — finds by brandSlug + modelSlug with carVersions, throws NotFoundError
- `UpdateModelUseCase` — finds by id, validates new slug uniqueness within brand, updates
- `DeleteModelUseCase` — checks hasCarVersions, throws BadRequestError if children exist, deletes

**CarVersions (5):**
- `CreateCarVersionUseCase` — validates model exists, calls `Slug.createForCarVersion()`, validates uniqueness, creates
- `ListCarVersionsByModelUseCase` — finds model, returns its carVersions
- `FindCarVersionBySlugUseCase` — finds by slug, throws NotFoundError
- `UpdateCarVersionUseCase` — finds by id, regenerates slug if versionName changed, validates uniqueness, updates
- `DeleteCarVersionUseCase` — checks hasReviews, throws BadRequestError if reviews exist, deletes

---

### Controllers (3)

**BrandsController** (`/brands`):
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/brands` | @IsPublic | List all brands |
| GET | `/brands/:slug` | @IsPublic | Get brand with models |
| POST | `/brands` | @AdminOnly | Create brand |
| PATCH | `/brands/:id` | @AdminOnly | Update brand |
| DELETE | `/brands/:id` | @AdminOnly | Delete brand |

**ModelsController** (`/brands/:brandSlug/models`):
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/brands/:brandSlug/models` | @IsPublic | List models for brand |
| GET | `/brands/:brandSlug/models/:modelSlug` | @IsPublic | Get model with versions |
| POST | `/models` | @AdminOnly | Create model (brandId in body) |
| PATCH | `/models/:id` | @AdminOnly | Update model |
| DELETE | `/models/:id` | @AdminOnly | Delete model |

**CarVersionsController** (`/car-versions`):
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/brands/:brandSlug/models/:modelSlug/versions` | @IsPublic | List versions for model |
| GET | `/car-versions/:slug` | @IsPublic | Get car version by slug |
| POST | `/car-versions` | @AdminOnly | Create car version (modelId in body) |
| PATCH | `/car-versions/:id` | @AdminOnly | Update car version |
| DELETE | `/car-versions/:id` | @AdminOnly | Delete car version |

**URL design rationale**: Read endpoints use nested slug routes for SEO-friendly URLs (`/brands/toyota/models/corolla/versions`). Mutation endpoints use flat routes with IDs for simplicity — admins work with IDs, not slugs.

---

### Mappers (3)

- `toBrandResponseDto(brand: BrandEntity): BrandResponseDto`
- `toModelResponseDto(model: ModelEntity): ModelResponseDto`
- `toCarVersionResponseDto(version: CarVersionEntity): CarVersionResponseDto`

All follow the `toUserResponseDto` pattern with `plainToInstance`.

---

### Module Wiring

**DatabaseModule** additions:
- `{ provide: BrandsRepositoryProps, useClass: PrismaBrandsRepository }`
- `{ provide: ModelsRepositoryProps, useClass: PrismaModelsRepository }`
- `{ provide: CarVersionsRepositoryProps, useClass: PrismaCarVersionsRepository }`

**HttpModule** additions:
- Controllers: `BrandsController`, `ModelsController`, `CarVersionsController`
- Providers: all 15 use cases

**main.ts** addition:
- Register `NotFoundInterceptor` globally (alongside `BadRequestInterceptor`)
- Register `RolesGuard` globally (via `APP_GUARD` token in AuthModule, same as JwtAuthGuard)

---

## Error Handling Strategy

| Error Scenario | Error Type | HTTP Status | Message |
|----------------|-----------|-------------|---------|
| Brand/Model/Version not found | NotFoundError | 404 | "Marca não encontrada" / "Modelo não encontrado" / "Versão não encontrada" |
| Duplicate slug | BadRequestError | 400 | "Já existe uma marca com este nome" etc. |
| Delete with children | BadRequestError | 400 | "Não é possível excluir: existem modelos vinculados" etc. |
| Non-admin mutation | Forbidden (NestJS) | 403 | "Acesso restrito a administradores" |
| Invalid input | ValidationPipe | 400 | Auto-generated from class-validator |

---

## Tech Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Slug generation | Native `normalize('NFD')` + regex | No extra dependency needed for accent handling |
| Slug as value object class | Static methods on `Slug` class | Consistent with spec requirement, reusable, testable |
| Admin guard as global + decorator | `RolesGuard` as global guard with `@AdminOnly()` metadata | Mirrors `JwtAuthGuard` + `@IsPublic()` pattern — consistent |
| Read routes nested, write routes flat | `/brands/:slug/models` vs `POST /models` | SEO-friendly reads, simple writes |
| Always include roles in findById | Modify existing query | Roles are tiny (1-2 records), needed for every authenticated request |
| One controller per entity | 3 controllers | Clear separation, each stays small |
| NotFoundError as new error type | New class + interceptor | `BadRequestError` is semantically wrong for 404 |
