import { Injectable, OnModuleInit } from "@nestjs/common";
import {
	createTestAccount,
	createTransport,
	getTestMessageUrl,
	SendMailOptions,
	Transporter,
} from "nodemailer";
import { env } from "src/env";
import { GenerateMailTemplateFromHTMLService } from "./generate-template-from-html";
import {
	MailContactProps,
	MailProviderProps,
	SendMailServiceDataProps,
} from "./types/mail-provider.props";

export class FakeEmailProvider implements MailProviderProps {
	public items: Array<{ to: string; html: string }> = [];

	async execute({ to, templateVariables }: SendMailServiceDataProps) {
		const recipient: MailContactProps = Array.isArray(to) ? to[0]! : to;
		const html = Object.values(templateVariables).filter(Boolean).join(" ");

		this.items.push({ to: recipient.email, html });
	}
}

@Injectable()
export class FakeMailProvider implements MailProviderProps, OnModuleInit {
	private transporter: Transporter;

	constructor(
		private generateMailTemplateFromHTMLService: GenerateMailTemplateFromHTMLService,
	) {}

	async onModuleInit() {
		const { smtp, user, pass } = await createTestAccount();

		this.transporter = createTransport({
			host: smtp.host,
			port: smtp.port,
			secure: smtp.secure,
			auth: {
				user,
				pass,
			},
		});
	}

	public async execute({
		from = {
			email: env.MAIL_SENDER_EMAIL,
			name: env.MAIL_SENDER_NAME,
		},
		to,
		subject,
		templateFileName,
		templateVariables,
	}: SendMailServiceDataProps): Promise<void> {
		const mail: SendMailOptions = {
			from: {
				address: from.email,
				name: from.name,
			},

			to: Array.isArray(to)
				? to.map(({ email, name }) => ({ address: email, name }))
				: { address: to.email, name: to.name },

			subject,
		};

		mail.html = await this.generateMailTemplateFromHTMLService.execute({
			fileName: templateFileName,
			variables: templateVariables,
		});

		const sentMail = await this.transporter.sendMail(mail);

		console.log(
			"Email gerado com sucesso",
			`E-mail preview URL: ${getTestMessageUrl(sentMail)}`,
		);
	}
}
