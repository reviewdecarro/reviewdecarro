import { randomUUID } from "node:crypto";
import { UserTokenEntity } from "../entities/user-token.entity";
import {
	CreateUserTokenData,
	UserTokensRepositoryProps,
} from "./user-tokens.repository";

export class InMemoryUserTokensRepository extends UserTokensRepositoryProps {
	public items: UserTokenEntity[] = [];

	async create(data: CreateUserTokenData): Promise<UserTokenEntity> {
		const now = new Date();

		const entity = new UserTokenEntity({
			id: randomUUID(),
			refreshToken: data.refreshToken,
			expiresDate: data.expiresDate,
			userId: data.userId,
			createdAt: now,
			updatedAt: now,
		});

		this.items.push(entity);

		return entity;
	}

	async findByRefreshToken(
		refreshToken: string,
	): Promise<UserTokenEntity | null> {
		return (
			this.items.find((token) => token.refreshToken === refreshToken) ?? null
		);
	}

	async deleteById(id: string): Promise<void> {
		this.items = this.items.filter((token) => token.id !== id);
	}
}
