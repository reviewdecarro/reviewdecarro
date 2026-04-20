import { beforeEach, describe, expect, it } from "@jest/globals";
import { FakeHashProvider } from "src/infra/providers/hash/fake-hash-provider";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { InMemoryUsersRepository } from "../repositories/in-memory-users.repository";
import { CreateUserUseCase } from "./create-user.usecase";

describe("CreateUserUseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: CreateUserUseCase;
	let fakeHashProvider: FakeHashProvider;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		sut = new CreateUserUseCase(usersRepository, fakeHashProvider);
	});

	const input = {
		username: "johndoe",
		email: "john@email.com",
		password: "12345678",
	};

	it("should return user with id and without passwordHash", async () => {
		const result = await sut.execute(input);

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("username", "johndoe");
		expect(result).toHaveProperty("email", "john@email.com");
		expect(result).toHaveProperty("createdAt");
		expect(result).not.toHaveProperty("passwordHash");
		expect(result).not.toHaveProperty("password");

		expect(usersRepository.items).toHaveLength(1);
		expect(usersRepository.items[0]?.passwordHash).not.toBe(input.password);
	});

	it("should throw BadRequestError if email already exists", async () => {
		usersRepository.items.push(
			new UserEntity({
				id: "existing",
				username: "another",
				email: input.email,
				passwordHash: "hashed",
			}),
		);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow("Email already exists");
	});

	it("should throw BadRequestError if username already exists", async () => {
		usersRepository.items.push(
			new UserEntity({
				id: "existing",
				username: input.username,
				email: "another@email.com",
				passwordHash: "hashed",
			}),
		);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow("Username already exists");
	});
});
