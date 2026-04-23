import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AuthService } from "../../../infra/auth/auth.service";
import { FakeHashProvider } from "../../../infra/providers/hash/fake-hash-provider";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { InMemoryUsersRepository } from "../repositories/in-memory-users.repository";
import { AuthenticateUserUseCase } from "./authenticate-user.usecase";

const mockAuthService: jest.Mocked<Pick<AuthService, "generateToken">> = {
	generateToken: jest.fn(),
};

describe("AuthenticateUserUseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let hashProvider: FakeHashProvider;
	let sut: AuthenticateUserUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		hashProvider = new FakeHashProvider();
		sut = new AuthenticateUserUseCase(
			usersRepository,
			mockAuthService as unknown as AuthService,
			hashProvider,
		);
		jest.clearAllMocks();
	});

	const input = {
		email: "john@email.com",
		password: "12345678",
	};

	it("should return access_token on valid credentials", async () => {
		usersRepository.items.push(
			new UserEntity({
				id: "uuid-123",
				email: input.email,
				username: "johndoe",
				passwordHash: await hashProvider.hash(input.password),
			}),
		);

		mockAuthService.generateToken.mockResolvedValue({
			access_token: "jwt-token",
		});

		const result = await sut.execute(input);

		expect(result).toEqual({ access_token: "jwt-token" });
		expect(mockAuthService.generateToken).toHaveBeenCalledWith({
			sub: "uuid-123",
			email: input.email,
			roles: [],
		});
	});

	it("should throw BadRequestError when email not found", async () => {
		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow(
			"Invalid email or password",
		);
	});

	it("should throw BadRequestError when password is wrong", async () => {
		usersRepository.items.push(
			new UserEntity({
				id: "uuid-123",
				email: input.email,
				username: "johndoe",
				passwordHash: await hashProvider.hash("different-password"),
			}),
		);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow(
			"Invalid email or password",
		);
	});
});
