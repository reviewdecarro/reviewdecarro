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
			new RoleEntity({
				id: "r-1",
				name: "admin",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);

		const result = await sut.execute({ name: "admin" });

		expect(result).toHaveProperty("id", "r-1");
		expect(result).toHaveProperty("name", "admin");
		expect(result).toHaveProperty("createdAt");
		expect(result).toHaveProperty("updatedAt");
	});

	it("should throw BadRequestError if role name already exists", async () => {
		mockRolesRepository.findByName.mockResolvedValue(
			new RoleEntity({
				id: "r-1",
				name: "admin",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);

		await expect(sut.execute({ name: "admin" })).rejects.toThrow(
			BadRequestError,
		);
		await expect(sut.execute({ name: "admin" })).rejects.toThrow(
			"Role already exists",
		);
	});
});
