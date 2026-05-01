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
			new RoleEntity({
				id: "r-1",
				name: "admin",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
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
