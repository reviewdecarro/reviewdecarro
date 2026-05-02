import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

const signAsyncMock = jest.fn() as any;
const mockJwtService = {
	signAsync: signAsyncMock,
} as unknown as JwtService;

describe("AuthService", () => {
	let sut: AuthService;

	beforeEach(() => {
		sut = new AuthService(mockJwtService as unknown as JwtService);
		jest.clearAllMocks();
	});

	describe("generateToken", () => {
		it("should return an accessToken", async () => {
			signAsyncMock.mockResolvedValue("jwt-token-123");

			const result = await sut.generateToken({
				sub: "user-id",
				sessionId: "session-id",
			});

			expect(result).toEqual({ accessToken: "jwt-token-123" });
			expect(signAsyncMock).toHaveBeenCalledWith({
				sub: "user-id",
				sessionId: "session-id",
			});
		});
	});
});
