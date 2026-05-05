import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UnauthorizedException } from "@nestjs/common";
import { SessionEntity } from "../../../application/sessions/entities/session.entity";
import { SessionsRepositoryProps } from "../../../application/sessions/repositories/sessions.repository";
import { UserEntity } from "../../../application/users/entities/user.entity";
import { UsersRepositoryProps } from "../../../application/users/repositories/users.repository";
import { JwtStrategy } from "./jwt.strategy";

const mockSessionsRepository: jest.Mocked<
	Pick<SessionsRepositoryProps, "findById">
> = {
	findById: jest.fn(),
};

const mockUsersRepository: jest.Mocked<Pick<UsersRepositoryProps, "findById">> =
	{
		findById: jest.fn(),
	};

describe("JwtStrategy", () => {
	let sut: JwtStrategy;

	beforeEach(() => {
		sut = new JwtStrategy(
			mockSessionsRepository as unknown as SessionsRepositoryProps,
			mockUsersRepository as unknown as UsersRepositoryProps,
		);
		jest.clearAllMocks();
	});

	describe("validate", () => {
		it("should return userId, sessionId and roles when session and user are valid", async () => {
			const session = new SessionEntity({
				id: "session-id",
				userId: "user-id",
				isRevoked: false,
				expiresAt: new Date(Date.now() + 60_000),
				refreshToken: "hash",
				createdAt: new Date(),
				userAgent: null,
				ipAddress: null,
			});

			const user = new UserEntity({
				id: "user-id",
				email: "john@email.com",
				username: "johndoe",
				roles: [],
			});

			mockSessionsRepository.findById.mockResolvedValue(session);
			mockUsersRepository.findById.mockResolvedValue(user);

			const result = await sut.validate({
				sub: "user-id",
				sessionId: "session-id",
			});

			expect(result).toMatchObject({
				id: "user-id",
				email: "john@email.com",
				username: "johndoe",
				sessionId: "session-id",
				roles: [],
			});
		});

		it("should throw UnauthorizedException when session not found", async () => {
			mockSessionsRepository.findById.mockResolvedValue(null);

			await expect(
				sut.validate({ sub: "user-id", sessionId: "session-id" }),
			).rejects.toThrow(UnauthorizedException);
		});

		it("should throw UnauthorizedException when session is revoked", async () => {
			const session = new SessionEntity({
				id: "session-id",
				userId: "user-id",
				isRevoked: true,
				expiresAt: new Date(Date.now() + 60_000),
				refreshToken: "hash",
				createdAt: new Date(),
				userAgent: null,
				ipAddress: null,
			});

			mockSessionsRepository.findById.mockResolvedValue(session);

			await expect(
				sut.validate({ sub: "user-id", sessionId: "session-id" }),
			).rejects.toThrow(UnauthorizedException);
		});

		it("should throw UnauthorizedException when session is expired", async () => {
			const session = new SessionEntity({
				id: "session-id",
				userId: "user-id",
				isRevoked: false,
				expiresAt: new Date(Date.now() - 1),
				refreshToken: "hash",
				createdAt: new Date(),
				userAgent: null,
				ipAddress: null,
			});

			mockSessionsRepository.findById.mockResolvedValue(session);

			await expect(
				sut.validate({ sub: "user-id", sessionId: "session-id" }),
			).rejects.toThrow(UnauthorizedException);
		});

		it("should throw UnauthorizedException when user not found", async () => {
			const session = new SessionEntity({
				id: "session-id",
				userId: "user-id",
				isRevoked: false,
				expiresAt: new Date(Date.now() + 60_000),
				refreshToken: "hash",
				createdAt: new Date(),
				userAgent: null,
				ipAddress: null,
			});

			mockSessionsRepository.findById.mockResolvedValue(session);
			mockUsersRepository.findById.mockResolvedValue(null);

			await expect(
				sut.validate({ sub: "user-id", sessionId: "session-id" }),
			).rejects.toThrow(UnauthorizedException);
		});
	});
});
