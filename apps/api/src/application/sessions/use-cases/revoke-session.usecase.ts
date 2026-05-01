import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HashProviderProps } from "src/infra/providers/hash/types/hash-provider.props";
import { RefreshDto } from "../dtos/refresh.dto";
import { SessionsRepositoryProps } from "../repositories/sessions.repository";

@Injectable()
export class RevokeSessionUseCase {
	constructor(
		private sessionsRepository: SessionsRepositoryProps,
		private hashProvider: HashProviderProps,
	) {}

	async execute({ sessionId, refreshToken }: RefreshDto): Promise<void> {
		const session = await this.sessionsRepository.findById(sessionId);

		if (!session) {
			throw new UnauthorizedException();
		}

		const tokenMatch = await this.hashProvider.compare(
			refreshToken,
			session.refreshToken,
		);

		if (!tokenMatch) {
			throw new UnauthorizedException();
		}

		await this.sessionsRepository.revoke(session.id);
	}
}
