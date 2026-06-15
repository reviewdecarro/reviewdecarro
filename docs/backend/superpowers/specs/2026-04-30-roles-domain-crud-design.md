# Roles application CRUD — Design Spec

**Date:** 2026-04-30
**Scope:** Refactor `Role` entity to standalone definition, add `createRole`, `findById`, `findRoles` use cases.

---

## Context

The current `Role` model is a per-user assignment record (`userId + type: RoleType`). The new design makes `Role` a standalone definition that many users can share via a many-to-many relation. `RoleType` enum is deleted.

---

## Prisma Schema Changes

**New `Role` model** (replaces existing):

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

**`User` model update:** add `roles Role[]` to establish implicit many-to-many. Prisma creates a `_RoleToUser` join table automatically.

**Delete:** `RoleType` enum.

---

## Files Changed / Created

### `application/roles/entities/role.entity.ts`

Replace `type: RoleType` and `userId: string` with:

- `name: string` (`@Expose()`)
- `createdAt: Date` (`@Expose()`)
- `updatedAt: Date` (`@Expose()`)

### `application/roles/dtos/role.dto.ts` (new)

- `RoleResponseDto` — exposes `id`, `name`, `createdAt`, `updatedAt`
- `CreateRoleDto` — `@IsString() @IsNotEmpty() name: string`

### `application/roles/mappers/role.mapper.ts` (new)

- `RolesMapper.toRoleResponseDto(entity: RoleEntity): RoleResponseDto`
- Uses `plainToInstance` with `excludeExtraneousValues: true`

### `application/roles/repositories/roles.repository.ts`

Replace `assign(data: AssignRoleData)` with:

- `create(name: string): Promise<RoleEntity>`
- `findById(id: string): Promise<RoleEntity | null>`
- `findAll(): Promise<RoleEntity[]>`
- `findByName(name: string): Promise<RoleEntity | null>`
- `assign(userId: string, roleId: string): Promise<void>` — connects an existing role to a user via the many-to-many

### `application/roles/repositories/in-memory-roles.repository.ts`

Implement all new methods using an in-memory array.

### `infra/database/prisma/repositories/prisma-roles.repository.ts`

Implement all new methods using Prisma client.

### `application/roles/use-cases/create-role.usecase.ts` (new)

- Input: `CreateRoleDto`
- Check `findByName(name)` → throw `BadRequestError("Role already exists")` if found
- Call `repository.create(name)` → return `RolesMapper.toRoleResponseDto(entity)`
- Spec: test success case + duplicate name case

### `application/roles/use-cases/find-role-by-id.usecase.ts` (new)

- Input: `id: string`
- Call `repository.findById(id)` → throw `NotFoundError("Role not found")` if null
- Return `RolesMapper.toRoleResponseDto(entity)`
- Spec: test found case + not-found case

### `application/roles/use-cases/find-roles.usecase.ts` (new)

- No input
- Call `repository.findAll()` → map each through `RolesMapper.toRoleResponseDto`
- Spec: test non-empty list + empty list

### `application/roles/use-cases/assign-role.usecase.ts`

Update to accept `{ userId: string, roleId: string }` instead of `{ userId, type: RoleType }`. Calls `repository.assign(userId, roleId)`.

---

## Response Shape

`RoleResponseDto`:

```json
{
  "id": "uuid",
  "name": "admin",
  "createdAt": "2026-04-30T...",
  "updatedAt": "2026-04-30T..."
}
```

No `users` array in the role response — user lists belong to a separate endpoint if needed.

---

## Error Handling

| Scenario                         | Error                                                     |
| -------------------------------- | --------------------------------------------------------- |
| `createRole` with duplicate name | `BadRequestError("Role already exists")`                  |
| `findById` with unknown id       | `NotFoundError("Role not found")`                         |
| `assign` with unknown roleId     | `NotFoundError("Role not found")` (checked before assign) |

---

## Out of Scope

- HTTP controllers / routes for roles (not requested)
- Role-based authorization guards
- Listing users per role
