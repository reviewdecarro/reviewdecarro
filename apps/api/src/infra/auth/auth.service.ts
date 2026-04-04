import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepositoryProps } from "src/application/users/repositories/users.repository";
import { JwtPayload } from "./types/jwt-payload";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private usersRepository: UsersRepositoryProps,
	) {}

	async generateToken(payload: JwtPayload) {
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}

	public async validateUser(user_id: string) {
		const user = await this.usersRepository.findById(user_id);
		if (!user) {
			throw new ForbiddenException(
				"Código de identificação de usuário inválido",
			);
		}

		return user;
	}
}
