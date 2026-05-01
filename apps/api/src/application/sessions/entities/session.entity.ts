import { Exclude, Expose } from "class-transformer";
import type { SessionModel } from "../../../../prisma/generated/models/Session";

export class SessionEntity implements SessionModel {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Exclude()
	refreshToken: string;

	@Expose()
	userAgent: string | null;

	@Expose()
	ipAddress: string | null;

	@Expose()
	isRevoked: boolean;

	@Expose()
	expiresAt: Date;

	@Expose()
	createdAt: Date;

	constructor(partial: Partial<SessionEntity>) {
		Object.assign(this, partial);
	}
}
