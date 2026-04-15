import { randomUUID } from "node:crypto";
import type { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import { UsersRepositoryProps } from "./users.repository";

export class InMemoryUsersRepository extends UsersRepositoryProps {
	public items: UserEntity[] = [];

	async create(user: CreateUserDto): Promise<UserEntity> {
		const entity = new UserEntity({
			id: randomUUID(),
			username: user.username,
			email: user.email,
			passwordHash: user.password,
			active: true,
			createdAt: new Date(),
		});

		this.items.push(entity);

		return entity;
	}

	async findById(id: string): Promise<UserEntity | null> {
		return this.items.find((user) => user.id === id) ?? null;
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		return this.items.find((user) => user.email === email) ?? null;
	}

	async findByUsername(username: string): Promise<UserEntity | null> {
		return this.items.find((user) => user.username === username) ?? null;
	}
}
