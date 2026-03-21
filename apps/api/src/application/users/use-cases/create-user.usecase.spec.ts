import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { UsersRepositoryProps } from "../repositories/users.repository";
import { CreateUserUseCase } from "./create-user.usecase";

const mockUsersRepository: jest.Mocked<UsersRepositoryProps> = {
	create: jest.fn(),
	findById: jest.fn(),
	findByEmail: jest.fn(),
	findByUsername: jest.fn(),
};

describe("CreateUserUseCase", () => {
	let sut: CreateUserUseCase;

	beforeEach(() => {
		sut = new CreateUserUseCase(mockUsersRepository);
		jest.clearAllMocks();
	});

	const input = {
		username: "johndoe",
		email: "john@email.com",
		password: "12345678",
	};

	it("should return user with id and without passwordHash", async () => {
		mockUsersRepository.findByEmail.mockResolvedValue(null);
		mockUsersRepository.findByUsername.mockResolvedValue(null);
		mockUsersRepository.create.mockResolvedValue(
			new UserEntity({
				id: "uuid-123",
				username: input.username,
				email: input.email,
				passwordHash: "hashed",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute(input);

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("username", "johndoe");
		expect(result).toHaveProperty("email", "john@email.com");
		expect(result).toHaveProperty("createdAt");
		expect(result).not.toHaveProperty("passwordHash");
		expect(result).not.toHaveProperty("password");
	});

	it("should throw BadRequestError if email already exists", async () => {
		mockUsersRepository.findByEmail.mockResolvedValue(
			new UserEntity({ id: "existing", email: input.email }),
		);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow("Email already exists");
	});

	it("should throw BadRequestError if username already exists", async () => {
		mockUsersRepository.findByEmail.mockResolvedValue(null);
		mockUsersRepository.findByUsername.mockResolvedValue(
			new UserEntity({ id: "existing", username: input.username }),
		);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow("Username already exists");
	});
});
