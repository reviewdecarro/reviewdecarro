import { beforeEach, describe, expect, it } from "@jest/globals";
import { InMemoryRolesRepository } from "../../../domain/roles/repositories/in-memory-roles.repository";
import { AssignRoleUseCase } from "../../../domain/roles/use-cases/assign-role.usecase";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { InMemoryUserTokensRepository } from "../repositories/in-memory-user-tokens.repository";
import { InMemoryUsersRepository } from "../repositories/in-memory-users.repository";
import { ConfirmEmailUseCase } from "./confirm-email.usecase";

describe("ConfirmEmailUseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let userTokensRepository: InMemoryUserTokensRepository;
	let rolesRepository: InMemoryRolesRepository;
	let sut: ConfirmEmailUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		userTokensRepository = new InMemoryUserTokensRepository();
		rolesRepository = new InMemoryRolesRepository();
		const assignRoleUseCase = new AssignRoleUseCase(rolesRepository);
		sut = new ConfirmEmailUseCase(
			usersRepository,
			userTokensRepository,
			assignRoleUseCase,
		);
	});

	async function seedUserAndToken(overrides?: { expiresDate?: Date }) {
		usersRepository.items.push(
			new UserEntity({
				id: "user-1",
				username: "johndoe",
				email: "john@email.com",
				passwordHash: "hashed",
				confirmedEmail: false,
			}),
		);

		const token = await userTokensRepository.create({
			userId: "user-1",
			refreshToken: "valid-token",
			expiresDate:
				overrides?.expiresDate ?? new Date(Date.now() + 60 * 60 * 1000),
		});

		return token;
	}

	it("should confirm the user's email and delete the token", async () => {
		const token = await seedUserAndToken();

		await sut.execute({ token: token.refreshToken });

		expect(usersRepository.items[0]?.confirmedEmail).toBe(true);
		expect(userTokensRepository.items).toHaveLength(0);
	});

	it("should assign the USER role when confirming the email", async () => {
		const token = await seedUserAndToken();

		await sut.execute({ token: token.refreshToken });

		expect(rolesRepository.items).toHaveLength(1);
		expect(rolesRepository.items[0]?.userId).toBe("user-1");
		expect(rolesRepository.items[0]?.type).toBe("USER");
	});

	it("should throw BadRequestError if token does not exist", async () => {
		await expect(sut.execute({ token: "missing" })).rejects.toThrow(
			BadRequestError,
		);
		await expect(sut.execute({ token: "missing" })).rejects.toThrow(
			"Token inválido.",
		);
	});

	it("should throw BadRequestError if token is expired", async () => {
		const token = await seedUserAndToken({
			expiresDate: new Date(Date.now() - 1000),
		});

		await expect(sut.execute({ token: token.refreshToken })).rejects.toThrow(
			"Token expirado.",
		);
		expect(usersRepository.items[0]?.confirmedEmail).toBe(false);
		expect(userTokensRepository.items).toHaveLength(1);
		expect(rolesRepository.items).toHaveLength(0);
	});
});
