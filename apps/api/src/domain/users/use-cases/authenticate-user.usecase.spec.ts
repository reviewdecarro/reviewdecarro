import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AuthService } from "../../../infra/auth/auth.service";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { UsersRepositoryProps } from "../repositories/users.repository";
import { AuthenticateUserUseCase } from "./authenticate-user.usecase";

jest.mock("bcrypt", () => ({
	compare: jest.fn(),
}));

import { compare } from "bcrypt";

const mockCompare = compare as jest.Mock;

const mockUsersRepository: jest.Mocked<UsersRepositoryProps> = {
	create: jest.fn(),
	findById: jest.fn(),
	findByEmail: jest.fn(),
	findByUsername: jest.fn(),
};

const mockAuthService: jest.Mocked<Pick<AuthService, "generateToken">> = {
	generateToken: jest.fn(),
};

describe("AuthenticateUserUseCase", () => {
	let sut: AuthenticateUserUseCase;

	beforeEach(() => {
		sut = new AuthenticateUserUseCase(
			mockUsersRepository,
			mockAuthService as unknown as AuthService,
		);
		jest.clearAllMocks();
	});

	const input = {
		email: "john@email.com",
		password: "12345678",
	};

	it("should return access_token on valid credentials", async () => {
		const user = new UserEntity({
			id: "uuid-123",
			email: input.email,
			username: "johndoe",
			passwordHash: "hashed-password",
		});

		mockUsersRepository.findByEmail.mockResolvedValue(user);
		mockCompare.mockResolvedValue(true as never);
		mockAuthService.generateToken.mockResolvedValue({
			access_token: "jwt-token",
		});

		const result = await sut.execute(input);

		expect(result).toEqual({ access_token: "jwt-token" });
		expect(mockAuthService.generateToken).toHaveBeenCalledWith({
			sub: "uuid-123",
			email: input.email,
		});
	});

	it("should throw BadRequestError when email not found", async () => {
		mockUsersRepository.findByEmail.mockResolvedValue(null);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow(
			"Invalid email or password",
		);
	});

	it("should throw BadRequestError when password is wrong", async () => {
		const user = new UserEntity({
			id: "uuid-123",
			email: input.email,
			passwordHash: "hashed-password",
		});

		mockUsersRepository.findByEmail.mockResolvedValue(user);
		mockCompare.mockResolvedValue(false as never);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow(
			"Invalid email or password",
		);
	});
});
