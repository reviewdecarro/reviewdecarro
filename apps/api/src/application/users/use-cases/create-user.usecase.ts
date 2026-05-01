import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { EmailProviderProps } from "src/infra/providers/email/types/email-provider.props";
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
		private emailProvider: EmailProviderProps,
	) {}

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

		const baseUrl = process.env.EMAIL_CONFIRMATION_BASE_URL ?? "";
		const confirmationUrl = `${baseUrl}?token=${refreshToken}`;

		await this.emailProvider.sendEmail({
			to: user.email,
			subject: "Confirme seu e-mail",
			html: `<p>Olá ${user.username},</p><p>Clique <a href="${confirmationUrl}">aqui</a> para confirmar seu e-mail.</p>`,
		});

		return UsersMapper.toUserResponseDto(new UserEntity(user));
	}
}
