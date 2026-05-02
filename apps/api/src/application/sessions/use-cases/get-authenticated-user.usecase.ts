import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/application/users/entities/user.entity";
import { AuthService } from "src/infra/auth/auth.service";
import { UsersRepositoryProps } from "../../users/repositories/users.repository";
import { SessionsRepositoryProps } from "../repositories/sessions.repository";

@Injectable()
export class GetAuthenticatedUserUseCase {
	constructor(
		private authService: AuthService,
		private sessionsRepository: SessionsRepositoryProps,
		private usersRepository: UsersRepositoryProps,
	) {}

	async execute(accessToken?: string): Promise<UserEntity | null> {
		if (!accessToken) {
			return null;
		}

		const payload = await this.authService.verifyToken(accessToken);

		if (!payload) {
			return null;
		}

		const session = await this.sessionsRepository.findById(payload.sessionId);

		if (!session || session.isRevoked || session.expiresAt < new Date()) {
			return null;
		}

		const user = await this.usersRepository.findById(payload.sub);

		return user ? new UserEntity(user) : null;
	}
}
