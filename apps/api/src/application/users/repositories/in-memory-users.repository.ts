import { randomUUID } from "node:crypto";
import type { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import {
	type AdminUsersListParams,
	type AdminUsersListResult,
	UsersRepositoryProps,
} from "./users.repository";

export class InMemoryUsersRepository extends UsersRepositoryProps {
	public items: UserEntity[] = [];

	async create(user: CreateUserDto): Promise<UserEntity> {
		const entity = new UserEntity({
			id: randomUUID(),
			username: user.username,
			email: user.email,
			passwordHash: user.password,
			active: true,
			confirmedEmail: false,
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

	async countActive(): Promise<number> {
		return this.items.filter((user) => user.active).length;
	}

	async findManyForAdmin(
		params: AdminUsersListParams,
	): Promise<AdminUsersListResult> {
		const query = params.query?.trim().toLowerCase();
		const filtered = this.items
			.filter(
				(user) => !query || user.username.toLowerCase().includes(query),
			)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
		const start = (params.page - 1) * params.limit;

		return {
			users: filtered.slice(start, start + params.limit),
			total: filtered.length,
		};
	}

	async confirmEmail(id: string): Promise<void> {
		const user = this.items.find((item) => item.id === id);

		if (!user) {
			throw new Error("User not found.");
		}

		user.confirmedEmail = true;
	}

	async updatePassword(id: string, passwordHash: string): Promise<void> {
		const user = this.items.find((item) => item.id === id);

		if (!user) {
			throw new Error("User not found.");
		}

		user.passwordHash = passwordHash;
	}

	async delete(id: string): Promise<void> {
		const index = this.items.findIndex((item) => item.id === id);

		if (index === -1) {
			throw new Error("User not found.");
		}

		this.items.splice(index, 1);
	}
}
