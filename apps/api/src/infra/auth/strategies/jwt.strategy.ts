import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SessionsRepositoryProps } from "src/application/sessions/repositories/sessions.repository";
import { UsersRepositoryProps } from "src/application/users/repositories/users.repository";
import { jwtConstants } from "../constants/jwt.constants";
import { JwtPayload } from "../types/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private sessionsRepository: SessionsRepositoryProps,
		private usersRepository: UsersRepositoryProps,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

		return {
			userId: payload.sub,
			sessionId: payload.sessionId,
			roles: user.roles,
		};
	}
}
