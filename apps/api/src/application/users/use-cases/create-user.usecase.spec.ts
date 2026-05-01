import { beforeEach, describe, expect, it } from "@jest/globals";
import { FakeEmailProvider } from "src/infra/providers/email/fake-email.provider";
import { FakeHashProvider } from "src/infra/providers/hash/fake-hash-provider";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { InMemoryUserTokensRepository } from "../repositories/in-memory-user-tokens.repository";
import { InMemoryUsersRepository } from "../repositories/in-memory-users.repository";
import { CreateUserUseCase } from "./create-user.usecase";

describe("CreateUserUseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let userTokensRepository: InMemoryUserTokensRepository;
	let fakeHashProvider: FakeHashProvider;
	let fakeEmailProvider: FakeEmailProvider;
	let sut: CreateUserUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		userTokensRepository = new InMemoryUserTokensRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeEmailProvider = new FakeEmailProvider();
		sut = new CreateUserUseCase(
			usersRepository,
			userTokensRepository,
			fakeHashProvider,
			fakeEmailProvider,
		);
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
		expect(usersRepository.items[0]?.confirmedEmail).toBe(false);
	});

	it("should create a confirmation token and send a confirmation email", async () => {
		await sut.execute(input);

		expect(userTokensRepository.items).toHaveLength(1);
		const storedToken = userTokensRepository.items[0];
		expect(storedToken?.userId).toBe(usersRepository.items[0]?.id);
		expect(storedToken?.expiresDate.getTime()).toBeGreaterThan(Date.now());

		expect(fakeEmailProvider.items).toHaveLength(1);
		const sent = fakeEmailProvider.items[0];
		expect(sent?.to).toBe(input.email);
		expect(sent?.html).toContain(storedToken?.refreshToken ?? "");
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
		await expect(sut.execute(input)).rejects.toThrow("Email já existe.");
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
		await expect(sut.execute(input)).rejects.toThrow("Username já existe.");
	});
});
