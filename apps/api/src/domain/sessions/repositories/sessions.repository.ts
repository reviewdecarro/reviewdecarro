import type { SessionEntity } from "../entities/session.entity";

export interface CreateSessionData {
	userId: string;
	refreshTokenHash: string;
	userAgent?: string;
	ipAddress?: string;
	expiresAt: Date;
}

export abstract class SessionsRepositoryProps {
	abstract create(data: CreateSessionData): Promise<SessionEntity>;
	abstract findById(id: string): Promise<SessionEntity | null>;
	abstract revoke(id: string): Promise<void>;
	abstract updateRefreshToken(
		id: string,
		refreshTokenHash: string,
	): Promise<void>;
}
