import { randomUUID } from "node:crypto";
import { MailProviderProps } from "@infra/providers/email/types/mail-provider.props";
import { Injectable } from "@nestjs/common";
import { env } from "src/env";
import { HashProviderProps } from "src/infra/providers/hash/types/hash-provider.props";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import { UsersMapper } from "../mappers/user.mapper";
import { UserTokensRepositoryProps } from "../repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../repositories/users.repository";

const CONFIRMATION_EXPIRY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CreateUserUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private userTokensRepository: UserTokensRepositoryProps,
		private hashProvider: HashProviderProps,
		private mailProvider: MailProviderProps,
	) {}

	private async sendConfirmationEmail(
		name: string,
		email: string,
		token: string,
	) {
		await this.mailProvider.execute({
			to: { name, email },
			subject: "Confirmação de conta",
			templateVariables: {
				title: "Confirmação de conta!",
				message: `Olá, ${name}!
          <br/><br/>
          Seja bem-vindo(a) ao PapoAuto!
          <br/><br/>
          Para confirmar sua conta, clique no botão abaixo. O link irá expirar em 8 horas.
          <br/><br/>
          Com atenção,
          Equipe PapoAuto.`,
				label: "Confirmar conta",
				link: `${env.WEB_EMAIL_CONFIRMATION_BASE_URL}?token=${token}`,
			},
		});
	}

	async execute({ username, email, password }: CreateUserDto) {
		const emailExists = await this.usersRepository.findByEmail(email);

		if (emailExists) {
			throw new BadRequestError("Email já existe.");
		}

		const usernameExists = await this.usersRepository.findByUsername(username);

		if (usernameExists) {
			throw new BadRequestError("Username já existe.");
		}

		const passwordHash = await this.hashProvider.hash(password);

		const user = await this.usersRepository.create({
			username,
			email,
			password: passwordHash,
		});

		const refreshToken = randomUUID();
		const expiresDate = new Date(Date.now() + CONFIRMATION_EXPIRY_MS);

		await this.userTokensRepository.create({
			userId: user.id,
			refreshToken,
			expiresDate,
		});

		await this.sendConfirmationEmail(user.username, user.email, refreshToken);

		return UsersMapper.toUserResponseDto(new UserEntity(user));
	}
}
