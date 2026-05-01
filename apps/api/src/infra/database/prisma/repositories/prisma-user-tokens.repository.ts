import { Injectable } from "@nestjs/common";
import { UserTokenEntity } from "../../../../application/users/entities/user-token.entity";
import {
	CreateUserTokenData,
	UserTokensRepositoryProps,
} from "../../../../application/users/repositories/user-tokens.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserTokensRepository implements UserTokensRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateUserTokenData): Promise<UserTokenEntity> {
		const created = await this.prisma.userToken.create({
			data: {
				userId: data.userId,
				refreshToken: data.refreshToken,
				expiresDate: data.expiresDate,
			},
		});

		return new UserTokenEntity(created);
	}

	async findByRefreshToken(
		refreshToken: string,
	): Promise<UserTokenEntity | null> {
		const token = await this.prisma.userToken.findUnique({
			where: { refreshToken },
		});

		return token ? new UserTokenEntity(token) : null;
	}

	async deleteById(id: string): Promise<void> {
		await this.prisma.userToken.delete({ where: { id } });
	}
}
