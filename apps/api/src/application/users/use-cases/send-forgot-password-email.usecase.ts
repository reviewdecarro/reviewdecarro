import { randomUUID } from "node:crypto";
import { MailProviderProps } from "@infra/providers/email/types/mail-provider.props";
import { Injectable } from "@nestjs/common";
import { env } from "src/env";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { UserTokensRepositoryProps } from "../repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../repositories/users.repository";

const TOKEN_EXPIRY_HOURS = 2;

@Injectable()
export class SendForgotPasswordEmailUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private userTokensRepository: UserTokensRepositoryProps,
		private mailProvider: MailProviderProps,
	) {}

	private async sendForgotPasswordEmail(
		name: string,
		email: string,
		token: string,
	) {
		await this.mailProvider.execute({
			to: { name, email },
			subject: "Recuperação de senha",
			templateVariables: {
				title: "Recuperação de senha!",
				message: `Olá, ${name}!
          <br/><br/>
          Você solicitou a recuperação de senha no Roletronic.
          <br/><br/>
          Para recuperar sua senha, clique no botão abaixo. O link irá expirar em 5 horas.
          <br/><br/>
          Com atenção,
          Equipe PapoAuto.`,
				label: "Recuperar senha",
				link: `${env.WEB_FORGOT_PASSWORD_URL}?token=${token}`,
			},
		});
	}

	private async generateToken() {
		const token = randomUUID();
		const isExistToken =
			await this.userTokensRepository.findByRefreshToken(token);
		if (!isExistToken) {
			return token;
		}

		return this.generateToken();
	}

	async execute({ email }: ForgotPasswordDto): Promise<void> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new NotFoundError("Usuário não encontrado");
		}

		const refreshToken = this.generateToken();
		const expiresDate = new Date(
			Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
		);

		await this.userTokensRepository.create({
			userId: user.id,
			refreshToken,
			expiresDate,
		});

		await this.sendForgotPasswordEmail(user.username, user.email, refreshToken);
	}
}
