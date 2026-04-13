import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ForbiddenException } from "@nestjs/common";
import { UserEntity } from "../../../domain/users/entities/user.entity";
import { AuthService } from "../auth.service";
import { JwtStrategy } from "./jwt.strategy";

const mockAuthService: jest.Mocked<Pick<AuthService, "validateUser">> = {
	validateUser: jest.fn(),
};

describe("JwtStrategy", () => {
	let sut: JwtStrategy;

	beforeEach(() => {
		sut = new JwtStrategy(mockAuthService as unknown as AuthService);
		jest.clearAllMocks();
	});

	describe("validate", () => {
		it("should return user when valid payload", async () => {
			const user = new UserEntity({
				id: "uuid-123",
				email: "john@email.com",
				username: "johndoe",
			});
			mockAuthService.validateUser.mockResolvedValue(user);

			const result = await sut.validate({
				sub: "uuid-123",
				email: "john@email.com",
			});

			expect(result).toEqual(user);
			expect(mockAuthService.validateUser).toHaveBeenCalledWith("uuid-123");
		});

		it("should throw ForbiddenException when user not found", async () => {
			mockAuthService.validateUser.mockRejectedValue(
				new ForbiddenException("Código de identificação de usuário inválido"),
			);

			await expect(
				sut.validate({ sub: "invalid-id", email: "john@email.com" }),
			).rejects.toThrow(ForbiddenException);
		});
	});
});
