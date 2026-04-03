import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { jwtConstants } from "../constants/jwt.constants";
import { JwtPayload } from "../types/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: JwtPayload) {
		const user = await this.authService.validateUser(payload.sub);
		if (!user) {
			throw new ForbiddenException(
				"Código de identificação de usuário inválido.",
			);
		}

		return user;
	}
}
