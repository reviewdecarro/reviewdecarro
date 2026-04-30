# Roles Domain CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `Role` from a per-user assignment record to a standalone entity, and add `CreateRoleUseCase`, `FindRoleByIdUseCase`, and `FindRolesUseCase`.

**Architecture:** The `Role` model becomes a standalone definition (name, timestamps) with an implicit many-to-many to `User` via Prisma. The three new use cases follow the same pattern as the `cars` domain (DTOs + mapper + repository methods + injectable use cases). The existing `AssignRoleUseCase` and `ConfirmEmailUseCase` are updated to match the new contract. `RoleType` enum is deleted and the `RolesGuard` is updated to compare by role name.

**Tech Stack:** NestJS, Prisma 7, class-transformer, class-validator, Jest 30 with ts-jest.

---

## File Map

| Action | Path |
|---|---|
| Modify | `apps/api/prisma/schema.prisma` |
| Modify | `apps/api/src/domain/roles/entities/role.entity.ts` |
| Modify | `apps/api/src/domain/roles/repositories/roles.repository.ts` |
| Modify | `apps/api/src/domain/roles/repositories/in-memory-roles.repository.ts` |
| Modify | `apps/api/src/infra/database/prisma/repositories/prisma-roles.repository.ts` |
| Create | `apps/api/src/domain/roles/dtos/role.dto.ts` |
| Create | `apps/api/src/domain/roles/mappers/role.mapper.ts` |
| Create | `apps/api/src/domain/roles/use-cases/create-role.usecase.ts` |
| Create | `apps/api/src/domain/roles/use-cases/create-role.usecase.spec.ts` |
| Create | `apps/api/src/domain/roles/use-cases/find-role-by-id.usecase.ts` |
| Create | `apps/api/src/domain/roles/use-cases/find-role-by-id.usecase.spec.ts` |
| Create | `apps/api/src/domain/roles/use-cases/find-roles.usecase.ts` |
| Create | `apps/api/src/domain/roles/use-cases/find-roles.usecase.spec.ts` |
| Modify | `apps/api/src/domain/roles/use-cases/assign-role.usecase.ts` |
| Modify | `apps/api/src/domain/roles/use-cases/assign-role.usecase.spec.ts` |
| Modify | `apps/api/src/domain/users/use-cases/confirm-email.usecase.ts` |
| Modify | `apps/api/src/infra/auth/guards/roles.guard.ts` |
| Modify | `apps/api/src/infra/auth/decorators/roles.decorator.ts` |
| Delete | `apps/api/src/infra/auth/constants/roles.ts` |
| Create | `apps/api/prisma/seed.ts` |

---

## Task 1: Update Prisma schema

**Files:**
- Modify: `apps/api/prisma/schema.prisma`

- [ ] **Step 1: Replace the `Role` model and delete `RoleType` enum**

Find and replace the existing `Role` model block:
```prisma
model Role {
  id     String   @id @default(uuid())
  type   RoleType @default(USER)
  userId String

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, type])
  @@index([userId])
  @@map("roles")
}
```
With:
```prisma
model Role {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]

  @@map("roles")
}
```

Also remove the `RoleType` enum entirely:
```prisma
enum RoleType {
  ADMIN
  USER
}
```

The `User` model already has `roles Role[]` — no change needed there. Prisma will now treat this as implicit many-to-many (both sides have the other as an array), creating a `_RoleToUser` join table.

- [ ] **Step 2: Run the migration**

```bash
cd apps/api && pnpm dlx prisma migrate dev --name refactor-role-standalone
```

Expected: migration file created under `prisma/migrations/`, no errors.

- [ ] **Step 3: Regenerate Prisma client**

```bash
cd apps/api && pnpm dlx prisma generate
```

Expected: `prisma/generated/` updated. The `RoleModel` type now has `id`, `name`, `createdAt`, `updatedAt`. The `RoleType` enum file is gone.

- [ ] **Step 4: Commit**

```bash
git add apps/api/prisma/schema.prisma apps/api/prisma/migrations
git commit -m "feat(db): refactor Role to standalone entity with M2M user relation"
```

---

## Task 2: Update RoleEntity

**Files:**
- Modify: `apps/api/src/domain/roles/entities/role.entity.ts`

- [ ] **Step 1: Rewrite the entity to match the new schema**

Replace the entire file content:
```typescript
import { Expose } from "class-transformer";
import { RoleModel } from "../../../../prisma/generated/models/Role";

export class RoleEntity implements RoleModel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/domain/roles/entities/role.entity.ts
git commit -m "refactor(roles): update RoleEntity to match new schema"
```

---

## Task 3: Update RolesRepositoryProps and InMemoryRolesRepository

**Files:**
- Modify: `apps/api/src/domain/roles/repositories/roles.repository.ts`
- Modify: `apps/api/src/domain/roles/repositories/in-memory-roles.repository.ts`

- [ ] **Step 1: Rewrite the repository contract**

Replace the entire content of `roles.repository.ts`:
```typescript
import type { RoleEntity } from "../entities/role.entity";

export interface CreateRoleData {
  name: string;
}

export interface AssignRoleData {
  userId: string;
  roleId: string;
}

export abstract class RolesRepositoryProps {
  abstract create(data: CreateRoleData): Promise<RoleEntity>;
  abstract findById(id: string): Promise<RoleEntity | null>;
  abstract findAll(): Promise<RoleEntity[]>;
  abstract findByName(name: string): Promise<RoleEntity | null>;
  abstract assign(data: AssignRoleData): Promise<void>;
}
```

- [ ] **Step 2: Rewrite the in-memory repository**

Replace the entire content of `in-memory-roles.repository.ts`:
```typescript
import { randomUUID } from "node:crypto";
import { RoleEntity } from "../entities/role.entity";
import { AssignRoleData, CreateRoleData, RolesRepositoryProps } from "./roles.repository";

export class InMemoryRolesRepository extends RolesRepositoryProps {
  public items: RoleEntity[] = [];
  public assignments: AssignRoleData[] = [];

  async create(data: CreateRoleData): Promise<RoleEntity> {
    const entity = new RoleEntity({
      id: randomUUID(),
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.items.push(entity);
    return entity;
  }

  async findById(id: string): Promise<RoleEntity | null> {
    return this.items.find((r) => r.id === id) ?? null;
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.items;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return this.items.find((r) => r.name === name) ?? null;
  }

  async assign(data: AssignRoleData): Promise<void> {
    this.assignments.push(data);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/domain/roles/repositories/
git commit -m "refactor(roles): update repository contract and in-memory implementation"
```

---

## Task 4: Add DTOs and Mapper

**Files:**
- Create: `apps/api/src/domain/roles/dtos/role.dto.ts`
- Create: `apps/api/src/domain/roles/mappers/role.mapper.ts`

- [ ] **Step 1: Create `role.dto.ts`**

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "admin" })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class RoleResponseDto {
  @ApiProperty({ example: "uuid-123" })
  @Expose()
  id: string;

  @ApiProperty({ example: "admin" })
  @Expose()
  name: string;

  @ApiProperty({ example: "2026-04-30T00:00:00.000Z" })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: "2026-04-30T00:00:00.000Z" })
  @Expose()
  updatedAt: Date;
}
```

- [ ] **Step 2: Create `role.mapper.ts`**

```typescript
import { plainToInstance } from "class-transformer";
import { RoleResponseDto } from "../dtos/role.dto";
import { RoleEntity } from "../entities/role.entity";

export class RolesMapper {
  static toRoleResponseDto(role: RoleEntity): RoleResponseDto {
    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/domain/roles/dtos/ apps/api/src/domain/roles/mappers/
git commit -m "feat(roles): add RoleResponseDto, CreateRoleDto and RolesMapper"
```

---

## Task 5: CreateRoleUseCase (TDD)

**Files:**
- Create: `apps/api/src/domain/roles/use-cases/create-role.usecase.spec.ts`
- Create: `apps/api/src/domain/roles/use-cases/create-role.usecase.ts`

- [ ] **Step 1: Write the failing spec**

Create `create-role.usecase.spec.ts`:
```typescript
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { RoleEntity } from "../entities/role.entity";
import { RolesRepositoryProps } from "../repositories/roles.repository";
import { CreateRoleUseCase } from "./create-role.usecase";

const mockRolesRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByName: jest.fn(),
  assign: jest.fn(),
} as unknown as jest.Mocked<RolesRepositoryProps>;

describe("CreateRoleUseCase", () => {
  let sut: CreateRoleUseCase;

  beforeEach(() => {
    sut = new CreateRoleUseCase(mockRolesRepository);
    jest.clearAllMocks();
  });

  it("should create and return a RoleResponseDto", async () => {
    mockRolesRepository.findByName.mockResolvedValue(null);
    mockRolesRepository.create.mockResolvedValue(
      new RoleEntity({ id: "r-1", name: "admin", createdAt: new Date(), updatedAt: new Date() }),
    );

    const result = await sut.execute({ name: "admin" });

    expect(result).toHaveProperty("id", "r-1");
    expect(result).toHaveProperty("name", "admin");
    expect(result).toHaveProperty("createdAt");
    expect(result).toHaveProperty("updatedAt");
  });

  it("should throw BadRequestError if role name already exists", async () => {
    mockRolesRepository.findByName.mockResolvedValue(
      new RoleEntity({ id: "r-1", name: "admin", createdAt: new Date(), updatedAt: new Date() }),
    );

    await expect(sut.execute({ name: "admin" })).rejects.toThrow(BadRequestError);
    await expect(sut.execute({ name: "admin" })).rejects.toThrow("Role already exists");
  });
});
```

- [ ] **Step 2: Run spec to confirm it fails**

```bash
cd apps/api && pnpm test -- --testPathPatterns=create-role.usecase
```

Expected: FAIL — `Cannot find module './create-role.usecase'`

- [ ] **Step 3: Implement `create-role.usecase.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateRoleDto } from "../dtos/role.dto";
import { RoleEntity } from "../entities/role.entity";
import { RolesMapper } from "../mappers/role.mapper";
import { RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class CreateRoleUseCase {
  constructor(private rolesRepository: RolesRepositoryProps) {}

  async execute({ name }: CreateRoleDto) {
    const exists = await this.rolesRepository.findByName(name);

    if (exists) {
      throw new BadRequestError("Role already exists");
    }

    const role = await this.rolesRepository.create({ name });

    return RolesMapper.toRoleResponseDto(new RoleEntity(role));
  }
}
```

- [ ] **Step 4: Run spec to confirm it passes**

```bash
cd apps/api && pnpm test -- --testPathPatterns=create-role.usecase
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/domain/roles/use-cases/create-role.usecase.ts apps/api/src/domain/roles/use-cases/create-role.usecase.spec.ts
git commit -m "feat(roles): add CreateRoleUseCase"
```

---

## Task 6: FindRoleByIdUseCase (TDD)

**Files:**
- Create: `apps/api/src/domain/roles/use-cases/find-role-by-id.usecase.spec.ts`
- Create: `apps/api/src/domain/roles/use-cases/find-role-by-id.usecase.ts`

- [ ] **Step 1: Write the failing spec**

Create `find-role-by-id.usecase.spec.ts`:
```typescript
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { RoleEntity } from "../entities/role.entity";
import { RolesRepositoryProps } from "../repositories/roles.repository";
import { FindRoleByIdUseCase } from "./find-role-by-id.usecase";

const mockRolesRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByName: jest.fn(),
  assign: jest.fn(),
} as unknown as jest.Mocked<RolesRepositoryProps>;

describe("FindRoleByIdUseCase", () => {
  let sut: FindRoleByIdUseCase;

  beforeEach(() => {
    sut = new FindRoleByIdUseCase(mockRolesRepository);
    jest.clearAllMocks();
  });

  it("should return a RoleResponseDto when role exists", async () => {
    mockRolesRepository.findById.mockResolvedValue(
      new RoleEntity({ id: "r-1", name: "admin", createdAt: new Date(), updatedAt: new Date() }),
    );

    const result = await sut.execute("r-1");

    expect(result).toHaveProperty("id", "r-1");
    expect(result).toHaveProperty("name", "admin");
    expect(result).toHaveProperty("createdAt");
    expect(result).toHaveProperty("updatedAt");
  });

  it("should throw NotFoundError when role does not exist", async () => {
    mockRolesRepository.findById.mockResolvedValue(null);

    await expect(sut.execute("nonexistent")).rejects.toThrow(NotFoundError);
    await expect(sut.execute("nonexistent")).rejects.toThrow("Role not found");
  });
});
```

- [ ] **Step 2: Run spec to confirm it fails**

```bash
cd apps/api && pnpm test -- --testPathPatterns=find-role-by-id.usecase
```

Expected: FAIL — `Cannot find module './find-role-by-id.usecase'`

- [ ] **Step 3: Implement `find-role-by-id.usecase.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { RoleEntity } from "../entities/role.entity";
import { RolesMapper } from "../mappers/role.mapper";
import { RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class FindRoleByIdUseCase {
  constructor(private rolesRepository: RolesRepositoryProps) {}

  async execute(id: string) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return RolesMapper.toRoleResponseDto(new RoleEntity(role));
  }
}
```

- [ ] **Step 4: Run spec to confirm it passes**

```bash
cd apps/api && pnpm test -- --testPathPatterns=find-role-by-id.usecase
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/domain/roles/use-cases/find-role-by-id.usecase.ts apps/api/src/domain/roles/use-cases/find-role-by-id.usecase.spec.ts
git commit -m "feat(roles): add FindRoleByIdUseCase"
```

---

## Task 7: FindRolesUseCase (TDD)

**Files:**
- Create: `apps/api/src/domain/roles/use-cases/find-roles.usecase.spec.ts`
- Create: `apps/api/src/domain/roles/use-cases/find-roles.usecase.ts`

- [ ] **Step 1: Write the failing spec**

Create `find-roles.usecase.spec.ts`:
```typescript
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RoleEntity } from "../entities/role.entity";
import { RolesRepositoryProps } from "../repositories/roles.repository";
import { FindRolesUseCase } from "./find-roles.usecase";

const mockRolesRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByName: jest.fn(),
  assign: jest.fn(),
} as unknown as jest.Mocked<RolesRepositoryProps>;

describe("FindRolesUseCase", () => {
  let sut: FindRolesUseCase;

  beforeEach(() => {
    sut = new FindRolesUseCase(mockRolesRepository);
    jest.clearAllMocks();
  });

  it("should return a list of RoleResponseDtos", async () => {
    mockRolesRepository.findAll.mockResolvedValue([
      new RoleEntity({ id: "r-1", name: "admin", createdAt: new Date(), updatedAt: new Date() }),
      new RoleEntity({ id: "r-2", name: "user", createdAt: new Date(), updatedAt: new Date() }),
    ]);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("name", "admin");
    expect(result[1]).toHaveProperty("name", "user");
  });

  it("should return empty array when no roles exist", async () => {
    mockRolesRepository.findAll.mockResolvedValue([]);

    const result = await sut.execute();

    expect(result).toEqual([]);
  });
});
```

- [ ] **Step 2: Run spec to confirm it fails**

```bash
cd apps/api && pnpm test -- --testPathPatterns=find-roles.usecase
```

Expected: FAIL — `Cannot find module './find-roles.usecase'`

- [ ] **Step 3: Implement `find-roles.usecase.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity";
import { RolesMapper } from "../mappers/role.mapper";
import { RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class FindRolesUseCase {
  constructor(private rolesRepository: RolesRepositoryProps) {}

  async execute() {
    const roles = await this.rolesRepository.findAll();

    return roles.map((role) => RolesMapper.toRoleResponseDto(new RoleEntity(role)));
  }
}
```

- [ ] **Step 4: Run spec to confirm it passes**

```bash
cd apps/api && pnpm test -- --testPathPatterns=find-roles.usecase
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/domain/roles/use-cases/find-roles.usecase.ts apps/api/src/domain/roles/use-cases/find-roles.usecase.spec.ts
git commit -m "feat(roles): add FindRolesUseCase"
```

---

## Task 8: Update AssignRoleUseCase and its spec

**Files:**
- Modify: `apps/api/src/domain/roles/use-cases/assign-role.usecase.ts`
- Modify: `apps/api/src/domain/roles/use-cases/assign-role.usecase.spec.ts`

- [ ] **Step 1: Rewrite `assign-role.usecase.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { AssignRoleData, RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class AssignRoleUseCase {
  constructor(private rolesRepository: RolesRepositoryProps) {}

  async execute(data: AssignRoleData): Promise<void> {
    return this.rolesRepository.assign(data);
  }
}
```

- [ ] **Step 2: Rewrite `assign-role.usecase.spec.ts`**

```typescript
import { beforeEach, describe, expect, it } from "@jest/globals";
import { InMemoryRolesRepository } from "../repositories/in-memory-roles.repository";
import { AssignRoleUseCase } from "./assign-role.usecase";

describe("AssignRoleUseCase", () => {
  let rolesRepository: InMemoryRolesRepository;
  let sut: AssignRoleUseCase;

  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    sut = new AssignRoleUseCase(rolesRepository);
  });

  it("should assign a role to a user", async () => {
    await sut.execute({ userId: "user-1", roleId: "role-1" });

    expect(rolesRepository.assignments).toHaveLength(1);
    expect(rolesRepository.assignments[0]).toEqual({ userId: "user-1", roleId: "role-1" });
  });
});
```

- [ ] **Step 3: Run spec to confirm it passes**

```bash
cd apps/api && pnpm test -- --testPathPatterns=assign-role.usecase
```

Expected: PASS — 1 test

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/domain/roles/use-cases/assign-role.usecase.ts apps/api/src/domain/roles/use-cases/assign-role.usecase.spec.ts
git commit -m "refactor(roles): update AssignRoleUseCase to use roleId instead of RoleType"
```

---

## Task 9: Update PrismaRolesRepository

**Files:**
- Modify: `apps/api/src/infra/database/prisma/repositories/prisma-roles.repository.ts`

- [ ] **Step 1: Rewrite the Prisma repository**

```typescript
import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../../../../domain/roles/entities/role.entity";
import { AssignRoleData, CreateRoleData, RolesRepositoryProps } from "../../../../domain/roles/repositories/roles.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRolesRepository implements RolesRepositoryProps {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRoleData): Promise<RoleEntity> {
    const role = await this.prisma.role.create({ data: { name: data.name } });
    return new RoleEntity(role);
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    return role ? new RoleEntity(role) : null;
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((r) => new RoleEntity(r));
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({ where: { name } });
    return role ? new RoleEntity(role) : null;
  }

  async assign(data: AssignRoleData): Promise<void> {
    await this.prisma.role.update({
      where: { id: data.roleId },
      data: { users: { connect: { id: data.userId } } },
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/infra/database/prisma/repositories/prisma-roles.repository.ts
git commit -m "refactor(roles): update PrismaRolesRepository to implement new contract"
```

---

## Task 10: Update ConfirmEmailUseCase

`ConfirmEmailUseCase` previously assigned `type: "USER"` (a RoleType) to the user on email confirmation. It now needs to look up the role by name and assign it by ID.

**Files:**
- Modify: `apps/api/src/domain/users/use-cases/confirm-email.usecase.ts`

- [ ] **Step 1: Rewrite `confirm-email.usecase.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { AssignRoleUseCase } from "../../../domain/roles/use-cases/assign-role.usecase";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserTokensRepositoryProps } from "../repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../repositories/users.repository";
import { RolesRepositoryProps } from "../../../domain/roles/repositories/roles.repository";

interface ConfirmEmailInput {
  token: string;
}

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    private usersRepository: UsersRepositoryProps,
    private userTokensRepository: UserTokensRepositoryProps,
    private rolesRepository: RolesRepositoryProps,
    private assignRoleUseCase: AssignRoleUseCase,
  ) {}

  async execute({ token }: ConfirmEmailInput): Promise<void> {
    const userToken = await this.userTokensRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new BadRequestError("Token inválido.");
    }

    if (userToken.expiresDate.getTime() < Date.now()) {
      throw new BadRequestError("Token expirado.");
    }

    const userRole = await this.rolesRepository.findByName("user");

    if (!userRole) {
      throw new BadRequestError("Default user role not configured.");
    }

    await this.usersRepository.confirmEmail(userToken.userId);
    await this.assignRoleUseCase.execute({ userId: userToken.userId, roleId: userRole.id });
    await this.userTokensRepository.deleteById(userToken.id);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/domain/users/use-cases/confirm-email.usecase.ts
git commit -m "refactor(users): update ConfirmEmailUseCase to assign role by name lookup"
```

---

## Task 11: Update RolesGuard and Roles decorator

`RolesGuard` currently checks `role.type` against a `RoleType[]`. Since `RoleType` is deleted, it must now compare `role.name` against `string[]`.

**Files:**
- Modify: `apps/api/src/infra/auth/guards/roles.guard.ts`
- Modify: `apps/api/src/infra/auth/decorators/roles.decorator.ts`
- Delete: `apps/api/src/infra/auth/constants/roles.ts`

- [ ] **Step 1: Rewrite `roles.guard.ts`**

```typescript
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserEntity } from "../../../domain/users/entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;

    if (!user?.roles) {
      return false;
    }

    return user.roles.some((role) => requiredRoles.includes(role.name));
  }
}
```

- [ ] **Step 2: Rewrite `roles.decorator.ts`**

```typescript
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = Symbol("roles");

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

- [ ] **Step 3: Delete the unused constants file**

```bash
rm apps/api/src/infra/auth/constants/roles.ts
```

Check that nothing else imports from `constants/roles.ts`:
```bash
grep -rn "auth/constants/roles" apps/api/src --include="*.ts"
```

Expected: no output. If anything imports it, update those imports first.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/infra/auth/guards/roles.guard.ts apps/api/src/infra/auth/decorators/roles.decorator.ts
git rm apps/api/src/infra/auth/constants/roles.ts
git commit -m "refactor(auth): update RolesGuard and decorator to use role name strings"
```

---

## Task 12: Create Prisma seed for default roles

`ConfirmEmailUseCase` looks up the role named `"user"` at runtime. This role must exist in the database. Create a Prisma seed file that inserts the default roles.

**Files:**
- Create: `apps/api/prisma/seed.ts`
- Modify: `apps/api/package.json` (add prisma.seed config)

- [ ] **Step 1: Create `apps/api/prisma/seed.ts`**

```typescript
import { PrismaClient } from "../prisma/generated";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Register seed script in `apps/api/package.json`**

Add inside the top-level `"prisma"` key (create it if it doesn't exist):
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

- [ ] **Step 3: Run the seed**

```bash
cd apps/api && pnpm dlx prisma db seed
```

Expected: `"user"` and `"admin"` roles upserted, no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/prisma/seed.ts apps/api/package.json
git commit -m "feat(db): add Prisma seed for default user and admin roles"
```

---

## Task 13: Run full test suite

- [ ] **Step 1: Run all unit tests**

```bash
cd apps/api && pnpm test
```

Expected: all tests pass. If any test references `RoleType`, `role.type`, or `role.userId`, fix the import/assertion to use the new `role.name` field.

- [ ] **Step 2: Verify TypeScript compilation**

```bash
cd apps/api && pnpm build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit if any fixes were needed**

```bash
git add -p
git commit -m "fix(roles): resolve post-migration type errors"
```
