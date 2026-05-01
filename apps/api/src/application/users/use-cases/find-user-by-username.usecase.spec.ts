import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { InMemoryUsersRepository } from "../repositories/in-memory-users.repository";
import { FindUserByUsernameUseCase } from "./find-user-by-username.usecase";

describe("FindUserByUsernameUseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: FindUserByUsernameUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new FindUserByUsernameUseCase(usersRepository);
	});

	it("should return user without passwordHash", async () => {
		const date = new Date("2026-01-01");
		usersRepository.items.push(
			new UserEntity({
				id: "uuid-123",
				username: "johndoe",
				email: "john@email.com",
				passwordHash: "hashed",
				active: true,
				createdAt: date,
			}),
		);

		const result = await sut.execute("johndoe");

		expect(result).toEqual({
			id: "uuid-123",
			username: "johndoe",
			email: "john@email.com",
			active: true,
			createdAt: date,
		});
		expect(result).not.toHaveProperty("passwordHash");
	});

	it("should throw BadRequestError when user not found", async () => {
		await expect(sut.execute("unknown")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("unknown")).rejects.toThrow("User not found");
	});
});
