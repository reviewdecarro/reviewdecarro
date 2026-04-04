import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { UsersRepositoryProps } from "../repositories/users.repository";
import { FindUserByUsernameUseCase } from "./find-user-by-username.usecase";

const mockUsersRepository: jest.Mocked<UsersRepositoryProps> = {
	create: jest.fn(),
	findById: jest.fn(),
	findByEmail: jest.fn(),
	findByUsername: jest.fn(),
};

describe("FindUserByUsernameUseCase", () => {
	let sut: FindUserByUsernameUseCase;

	beforeEach(() => {
		sut = new FindUserByUsernameUseCase(mockUsersRepository);
		jest.clearAllMocks();
	});

	it("should return user without passwordHash", async () => {
		const date = new Date("2026-01-01");
		mockUsersRepository.findByUsername.mockResolvedValue(
			new UserEntity({
				id: "uuid-123",
				username: "johndoe",
				email: "john@email.com",
				passwordHash: "hashed",
				createdAt: date,
			}),
		);

		const result = await sut.execute("johndoe");

		expect(result).toEqual({
			id: "uuid-123",
			username: "johndoe",
			email: "john@email.com",
			createdAt: date,
		});
		expect(result).not.toHaveProperty("passwordHash");
		expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith("johndoe");
	});

	it("should throw BadRequestError when user not found", async () => {
		mockUsersRepository.findByUsername.mockResolvedValue(null);

		await expect(sut.execute("unknown")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("unknown")).rejects.toThrow("User not found");
	});
});
