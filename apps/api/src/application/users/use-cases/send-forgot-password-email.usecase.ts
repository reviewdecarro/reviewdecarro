import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { EmailProviderProps } from "src/infra/providers/email/types/email-provider.props";
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
		private emailProvider: EmailProviderProps,
	) {}

	async execute({ email }: ForgotPasswordDto): Promise<void> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new NotFoundError("Usuário não encontrado.");
		}

		const refreshToken = randomUUID();
		const expiresDate = new Date(
			Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
		);

		await this.userTokensRepository.create({
			userId: user.id,
			refreshToken,
			expiresDate,
		});

		const baseUrl = process.env.PASSWORD_RESET_BASE_URL ?? "";
		const resetUrl = `${baseUrl}?token=${refreshToken}`;

		await this.emailProvider.sendEmail({
			to: user.email,
			subject: "Redefinição de senha",
			html: `<p>Olá ${user.username},</p><p>Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha. O link expira em ${TOKEN_EXPIRY_HOURS} horas.</p>`,
		});
	}
}
