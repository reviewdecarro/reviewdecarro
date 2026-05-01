import { Injectable } from "@nestjs/common";
import { RolesRepositoryProps } from "../../../application/roles/repositories/roles.repository";
import { AssignRoleUseCase } from "../../../application/roles/use-cases/assign-role.usecase";
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
		private rolesRepository: RolesRepositoryProps,
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

		const userRole = await this.rolesRepository.findByName("user");

		if (!userRole) {
			throw new BadRequestError("Default user role not configured.");
		}

		await this.usersRepository.confirmEmail(userToken.userId);
		await this.assignRoleUseCase.execute({
			userId: userToken.userId,
			roleId: userRole.id,
		});
		await this.userTokensRepository.deleteById(userToken.id);
	}
}
