import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { AuthService } from "src/infra/auth/auth.service";
import { HashProviderProps } from "src/infra/providers/hash/types/hash-provider.props";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UsersRepositoryProps } from "../../users/repositories/users.repository";
import { LoginDto } from "../dtos/login.dto";
import { SessionsRepositoryProps } from "../repositories/sessions.repository";

const SESSION_EXPIRY_DAYS = 7;

@Injectable()
export class LoginUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private sessionsRepository: SessionsRepositoryProps,
		private hashProvider: HashProviderProps,
		private authService: AuthService,
	) {}

	async execute(
		{ email, password }: LoginDto,
		meta?: { userAgent?: string; ipAddress?: string },
	) {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new BadRequestError("E-mail ou senha inválidos.");
		}

		const passwordMatch = await this.hashProvider.compare(
			password,
			user.passwordHash,
		);

		if (!passwordMatch) {
			throw new BadRequestError("E-mail ou senha inválidos.");
		}

		const refreshToken = randomUUID();
		const refreshTokenHash = await this.hashProvider.hash(refreshToken);

		const expiresAt = new Date(
			Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
		);

		const session = await this.sessionsRepository.create({
			userId: user.id,
			refreshTokenHash,
			userAgent: meta?.userAgent,
			ipAddress: meta?.ipAddress,
			expiresAt,
		});

		const { accessToken } = await this.authService.generateToken({
			sub: user.id,
			sessionId: session.id,
		});

		return { accessToken, refreshToken, sessionId: session.id };
	}
}
