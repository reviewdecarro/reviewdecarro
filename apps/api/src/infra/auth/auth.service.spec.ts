import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../../domain/users/entities/user.entity";
import { UsersRepositoryProps } from "../../domain/users/repositories/users.repository";
import { AuthService } from "./auth.service";

const mockJwtService: jest.Mocked<Pick<JwtService, "signAsync">> = {
	signAsync: jest.fn(),
};

const mockUsersRepository: jest.Mocked<UsersRepositoryProps> = {
	create: jest.fn(),
	findById: jest.fn(),
	findByEmail: jest.fn(),
	findByUsername: jest.fn(),
	confirmEmail: jest.fn(),
};

describe("AuthService", () => {
	let sut: AuthService;

	beforeEach(() => {
		sut = new AuthService(
			mockJwtService as unknown as JwtService,
			mockUsersRepository,
		);
		jest.clearAllMocks();
	});

	describe("generateToken", () => {
		it("should return an access_token", async () => {
			mockJwtService.signAsync.mockResolvedValue("jwt-token-123");

			const result = await sut.generateToken({
				sub: "user-id",
				email: "john@email.com",
			});

			expect(result).toEqual({ access_token: "jwt-token-123" });
			expect(mockJwtService.signAsync).toHaveBeenCalledWith({
				sub: "user-id",
				email: "john@email.com",
			});
		});
	});

	describe("validateUser", () => {
		it("should return user when found", async () => {
			const user = new UserEntity({
				id: "user-id",
				email: "john@email.com",
				username: "johndoe",
			});
			mockUsersRepository.findById.mockResolvedValue(user);

			const result = await sut.validateUser("user-id");

			expect(result).toEqual(user);
			expect(mockUsersRepository.findById).toHaveBeenCalledWith("user-id");
		});

		it("should throw ForbiddenException when user not found", async () => {
			mockUsersRepository.findById.mockResolvedValue(null);

			await expect(sut.validateUser("invalid-id")).rejects.toThrow(
				ForbiddenException,
			);
		});
	});
});
