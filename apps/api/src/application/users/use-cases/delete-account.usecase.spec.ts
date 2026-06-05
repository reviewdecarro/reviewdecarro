import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { InMemoryUsersRepository } from "../repositories/in-memory-users.repository";
import { DeleteAccountUseCase } from "./delete-account.usecase";

describe("DeleteAccountUseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: DeleteAccountUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new DeleteAccountUseCase(usersRepository);
	});

	it("should delete the account when user exists", async () => {
		usersRepository.items.push(
			new UserEntity({
				id: "uuid-123",
				username: "johndoe",
				email: "john@email.com",
				passwordHash: "hashed",
				active: true,
				createdAt: new Date(),
			}),
		);

		await sut.execute("uuid-123");

		expect(usersRepository.items).toHaveLength(0);
	});

	it("should throw BadRequestError when user does not exist", async () => {
		await expect(sut.execute("nonexistent-id")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("nonexistent-id")).rejects.toThrow("User not found");
	});
});
