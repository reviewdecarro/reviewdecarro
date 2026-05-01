import { Injectable } from "@nestjs/common";
import { SessionEntity } from "../../../../application/sessions/entities/session.entity";
import type {
	CreateSessionData,
	SessionsRepositoryProps,
} from "../../../../application/sessions/repositories/sessions.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaSessionsRepository implements SessionsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateSessionData): Promise<SessionEntity> {
		const session = await this.prisma.session.create({
			data: {
				userId: data.userId,
				refreshToken: data.refreshTokenHash,
				userAgent: data.userAgent,
				ipAddress: data.ipAddress,
				expiresAt: data.expiresAt,
			},
		});

		return new SessionEntity(session);
	}

	async findById(id: string): Promise<SessionEntity | null> {
		const session = await this.prisma.session.findUnique({ where: { id } });

		if (!session) return null;

		return new SessionEntity(session);
	}

	async revoke(id: string): Promise<void> {
		await this.prisma.session.update({
			where: { id },
			data: { isRevoked: true },
		});
	}

	async updateRefreshToken(
		id: string,
		refreshTokenHash: string,
	): Promise<void> {
		await this.prisma.session.update({
			where: { id },
			data: { refreshToken: refreshTokenHash },
		});
	}
}
