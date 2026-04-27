import { randomUUID } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/infra/auth/auth.service";
import { HashProviderProps } from "src/infra/providers/hash/types/hash-provider.props";
import { RefreshDto } from "../dtos/refresh.dto";
import { SessionsRepositoryProps } from "../repositories/sessions.repository";

@Injectable()
export class RefreshSessionUseCase {
	constructor(
		private sessionsRepository: SessionsRepositoryProps,
		private hashProvider: HashProviderProps,
		private authService: AuthService,
	) {}

	async execute({ sessionId, refreshToken }: RefreshDto) {
		const session = await this.sessionsRepository.findById(sessionId);

		if (!session) {
			throw new UnauthorizedException();
		}

		if (session.isRevoked || session.expiresAt < new Date()) {
			throw new UnauthorizedException();
		}

		const tokenMatch = await this.hashProvider.compare(
			refreshToken,
			session.refreshToken,
		);

		if (!tokenMatch) {
			throw new UnauthorizedException();
		}

		const newRefreshToken = randomUUID();
		const newRefreshTokenHash = await this.hashProvider.hash(newRefreshToken);
		await this.sessionsRepository.updateRefreshToken(session.id, newRefreshTokenHash);

		const { accessToken } = await this.authService.generateToken({
			sub: session.userId,
			sessionId: session.id,
		});

		return { accessToken, refreshToken: newRefreshToken };
	}
}
