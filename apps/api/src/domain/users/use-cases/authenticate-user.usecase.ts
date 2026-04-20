import { HashProviderProps } from "@infra/providers/hash/types/hash-provider.props";
import { Injectable } from "@nestjs/common";
import { Roles } from "src/infra/auth/constants/roles";
import { AuthService } from "../../../infra/auth/auth.service";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { LoginUserDto } from "../dtos/login-user.dto";
import { UsersRepositoryProps } from "../repositories/users.repository";

@Injectable()
export class AuthenticateUserUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private authService: AuthService,
		private hashProvider: HashProviderProps,
	) {}

	async execute({ email, password }: LoginUserDto) {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new BadRequestError("Invalid email or password");
		}

		const passwordMatch = await this.hashProvider.compare(
			password,
			user.passwordHash,
		);

		if (!passwordMatch) {
			throw new BadRequestError("Invalid email or password");
		}

		return await this.authService.generateToken({
			sub: user.id,
			email: user.email,
			roles: user?.roles?.map((role) => role.type as Roles) || [],
		});
	}
}
