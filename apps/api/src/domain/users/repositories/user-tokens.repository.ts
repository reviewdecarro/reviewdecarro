import type { UserTokenEntity } from "../entities/user-token.entity";

export interface CreateUserTokenData {
	userId: string;
	refreshToken: string;
	expiresDate: Date;
}

export abstract class UserTokensRepositoryProps {
	abstract create(data: CreateUserTokenData): Promise<UserTokenEntity>;
	abstract findByRefreshToken(
		refreshToken: string,
	): Promise<UserTokenEntity | null>;
	abstract deleteById(id: string): Promise<void>;
}
