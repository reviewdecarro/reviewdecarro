import { describe, expect, it } from "@jest/globals";
import { UserEntity } from "../entities/user.entity";
import { UsersMapper } from "./user.mapper";

describe("UsersMapper.toUserResponseDto", () => {
	it("should never expose passwordHash", () => {
		const user = new UserEntity({
			id: "123",
			username: "johndoe",
			email: "john@email.com",
			passwordHash: "hashed_password",
			createdAt: new Date("2026-01-01"),
		});

		const result = UsersMapper.toUserResponseDto(user);

		expect(result).not.toHaveProperty("passwordHash");
	});

	it("should expose only the expected properties", () => {
		const date = new Date("2026-01-01");
		const user = new UserEntity({
			id: "123",
			username: "johndoe",
			email: "john@email.com",
			passwordHash: "hashed_password",
			createdAt: date,
		});

		const result = UsersMapper.toUserResponseDto(user);

		expect(result).toEqual({
			id: "123",
			username: "johndoe",
			email: "john@email.com",
			createdAt: date,
		});
	});
});
