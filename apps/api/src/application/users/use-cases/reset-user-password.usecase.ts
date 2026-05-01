import { Injectable } from "@nestjs/common";
import { HashProviderProps } from "src/infra/providers/hash/types/hash-provider.props";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { UserTokensRepositoryProps } from "../repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../repositories/users.repository";

@Injectable()
export class ResetUserPasswordUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private userTokensRepository: UserTokensRepositoryProps,
		private hashProvider: HashProviderProps,
	) {}

	async execute({ token, password }: ResetPasswordDto): Promise<void> {
		const userToken = await this.userTokensRepository.findByRefreshToken(token);

		if (!userToken) {
			throw new NotFoundError("Token não encontrado.");
		}

		if (userToken.expiresDate.getTime() < Date.now()) {
			throw new BadRequestError("Token expirado.");
		}

		const user = await this.usersRepository.findById(userToken.userId);

		if (!user) {
			throw new NotFoundError("Usuário não encontrado.");
		}

		const passwordHash = await this.hashProvider.hash(password);
		await this.usersRepository.updatePassword(user.id, passwordHash);
		await this.userTokensRepository.deleteById(userToken.id);
	}
}
