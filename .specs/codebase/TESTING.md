# Testing

## Setup

- **Framework**: Jest 30.2.0 + ts-jest 29.4.6
- **Config**: Shared via `@repo/jest-config` (must build first: `pnpm build --filter=@repo/jest-config`)
- **E2E**: supertest 7.2.2, config at `apps/api/test/jest-e2e.json`

## Commands (from apps/api)

```bash
pnpm test                                    # All unit tests
pnpm test -- --testPathPatterns=<pattern>     # Filter by path
pnpm test:e2e                                # E2E tests
```

## Conventions

- Files: `*.spec.ts` co-located with source
- Imports: `import { describe, it, expect, jest, beforeEach } from "@jest/globals"`
- Mocking: `jest.Mocked<RepositoryProps>` with `jest.fn()` for each method
- SUT naming: `let sut: UseCaseClass`

## Current Coverage

| File | Has Tests |
|------|-----------|
| application/users/use-cases/create-user.usecase.ts | ✅ |
| application/users/use-cases/authenticate-user.usecase.ts | ✅ |
| application/users/use-cases/find-user-by-username.usecase.ts | ✅ |
| application/users/mappers/user.mapper.ts | ✅ |
| infra/auth/auth.service.ts | ✅ |
| infra/auth/strategies/jwt.strategy.ts | ✅ |

### Not Tested
- Controllers (no unit tests)
- Guards, interceptors, decorators
- Prisma repository implementations
- E2E tests (directory exists but no tests observed)

## Test Pattern (Use Cases)

```typescript
describe("CreateUserUseCase", () => {
  let sut: CreateUserUseCase;
  let mockRepo: jest.Mocked<UsersRepositoryProps>;

  beforeEach(() => {
    mockRepo = { create: jest.fn(), findByEmail: jest.fn(), ... };
    sut = new CreateUserUseCase(mockRepo);
    jest.clearAllMocks();
  });

  it("should throw BadRequestError if email exists", async () => {
    mockRepo.findByEmail.mockResolvedValue(new UserEntity({ ... }));
    await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
  });
});
```

## Gate Checks

- **Unit**: `pnpm test` — must pass before merging
- **Lint**: `pnpm lint` — must pass before merging
