import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SessionsRepositoryProps } from "src/application/sessions/repositories/sessions.repository";
import { UserEntity } from "src/application/users/entities/user.entity";
import { UsersRepositoryProps } from "src/application/users/repositories/users.repository";
import { jwtConstants } from "../constants/jwt.constants";
import { authCookieNames, parseCookieHeader } from "../cookies";
import { JwtPayload } from "../types/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private sessionsRepository: SessionsRepositoryProps,
		private usersRepository: UsersRepositoryProps,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(),
				(request: Request | null) => {
					const cookies = parseCookieHeader(request?.headers.cookie);
					return cookies[authCookieNames.accessToken] ?? null;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: JwtPayload) {
		const session = await this.sessionsRepository.findById(payload.sessionId);

		if (!session || session.isRevoked || session.expiresAt < new Date()) {
			throw new UnauthorizedException();
		}

		const user = await this.usersRepository.findById(payload.sub);

		if (!user) {
			throw new UnauthorizedException();
		}

		return Object.assign(new UserEntity(user), {
			sessionId: payload.sessionId,
		});
	}
}
