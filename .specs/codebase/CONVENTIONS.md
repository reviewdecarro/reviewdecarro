# Conventions

## Code Patterns

### Entities
- Class that `implements` Prisma model type from `prisma/generated/models/<ModelName>`
- Constructor: `constructor(partial: Partial<Entity>) { Object.assign(this, partial); }`
- Properties decorated with `@Expose()` / `@Exclude()` from class-transformer
- Sensitive fields (e.g. `passwordHash`) use `@Exclude()`

### Repositories
- Abstract class in `application/<module>/repositories/` defining the contract
- Prisma implementation in `infra/database/prisma/repositories/`
- Bound via NestJS DI in `DatabaseModule` using `{ provide: AbstractClass, useClass: PrismaImpl }`
- No `readonly` on constructor-injected dependencies

### Use Cases
- One class per business operation, `@Injectable()`
- Single `execute()` method
- Throws `BadRequestError` for business rule violations
- Returns mapped DTO (never raw entity with sensitive fields)

### Mappers
- Standalone functions (not classes): `toXxxResponseDto(entity)`
- Uses `plainToInstance(DtoClass, entity, { excludeExtraneousValues: true })`
- Only destructures needed fields from source

### DTOs
- Input DTOs: class-validator decorators (`@IsString()`, `@IsNotEmpty()`, etc.)
- Response DTOs: class-transformer `@Expose()` decorators
- No definite assignment (`!`) needed — `strictPropertyInitialization` disabled

### Controllers
- Live in `infra/http/controllers/<application>/`
- Inject use cases (not repositories)
- Use `@IsPublic()` for unauthenticated routes
- Use `@LoggedInUser()` to get authenticated user
- Swagger decorators for documentation

## Naming
- Files: `kebab-case` with suffix: `.usecase.ts`, `.entity.ts`, `.dto.ts`, `.mapper.ts`, `.spec.ts`
- Classes: `PascalCase` — `CreateUserUseCase`, `UserEntity`, `UsersRepositoryProps`
- Repository abstract classes: `<application>RepositoryProps`
- Prisma implementations: `Prisma<application>Repository`

## Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, etc.
- Plain `-m` strings — no heredoc, no Co-Authored-By
- Scope convention: `feat(api):`, `fix(web):`, etc.

## Imports
- Always remove unused imports after edits
- Test imports from `@jest/globals`
- Prisma model types from `prisma/generated/models/<ModelName>`
