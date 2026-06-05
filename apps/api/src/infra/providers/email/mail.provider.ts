import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { env } from "src/env";
import { BadRequestError } from "src/shared/errors/types/bad-request-error";
import { GenerateMailTemplateFromHTMLService } from "./generate-template-from-html";
import {
	MailProviderProps,
	SendMailServiceDataProps,
} from "./types/mail-provider.props";

@Injectable()
export class MailProvider implements MailProviderProps {
	private transporter = new Resend(env.RESEND_MAIL_KEY);

	constructor(
		private readonly generateMailTemplateFromHTMLService: GenerateMailTemplateFromHTMLService,
	) {}

	async execute({
		from = {
			email: env.MAIL_SENDER_EMAIL,
			name: env.MAIL_SENDER_NAME,
		},
		to,
		subject,
		templateFileName,
		templateVariables,
	}: SendMailServiceDataProps): Promise<void> {
		try {
			const mailTemplate =
				await this.generateMailTemplateFromHTMLService.execute({
					fileName: templateFileName,
					variables: templateVariables,
				});

			await this.transporter.emails.send({
				from: `${from.name} <${from.email}>`,
				to: Array.isArray(to)
					? to.map(({ name, email }) => `${name} <${email}>`)
					: [`${to.name} <${to.email}>`],
				subject,
				html: mailTemplate,
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new BadRequestError(`Erro ao enviar email: ${message}`);
		}
	}
}
