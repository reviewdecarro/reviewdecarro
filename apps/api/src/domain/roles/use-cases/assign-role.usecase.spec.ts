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
