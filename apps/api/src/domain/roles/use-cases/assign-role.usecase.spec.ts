import { beforeEach, describe, expect, it } from "@jest/globals";
import { RoleEntity } from "../entities/role.entity";
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
		const result = await sut.execute({ userId: "user-1", type: "USER" });

		expect(result).toBeInstanceOf(RoleEntity);
		expect(result.userId).toBe("user-1");
		expect(result.type).toBe("USER");
		expect(rolesRepository.items).toHaveLength(1);
	});
});
