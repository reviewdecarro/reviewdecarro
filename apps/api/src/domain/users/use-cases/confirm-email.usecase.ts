import { Injectable } from "@nestjs/common";
import { AssignRoleUseCase } from "../../../domain/roles/use-cases/assign-role.usecase";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserTokensRepositoryProps } from "../repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../repositories/users.repository";

interface ConfirmEmailInput {
	token: string;
}

@Injectable()
export class ConfirmEmailUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private userTokensRepository: UserTokensRepositoryProps,
		private assignRoleUseCase: AssignRoleUseCase,
	) {}

	async execute({ token }: ConfirmEmailInput): Promise<void> {
		const userToken = await this.userTokensRepository.findByRefreshToken(token);

		if (!userToken) {
			throw new BadRequestError("Token inválido.");
		}

		if (userToken.expiresDate.getTime() < Date.now()) {
			throw new BadRequestError("Token expirado.");
		}

		await this.usersRepository.confirmEmail(userToken.userId);
		await this.assignRoleUseCase.execute({ userId: userToken.userId, type: "USER" });
		await this.userTokensRepository.deleteById(userToken.id);
	}
}
