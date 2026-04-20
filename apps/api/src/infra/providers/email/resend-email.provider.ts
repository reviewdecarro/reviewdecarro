import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import {
	EmailProviderProps,
	SendEmailParams,
} from "./types/email-provider.props";

@Injectable()
export class ResendEmailProvider implements EmailProviderProps {
	private resend: Resend;
	private from: string;

	constructor() {
		const apiKey = process.env.RESEND_API_KEY;
		const from = process.env.RESEND_FROM_EMAIL;

		if (!apiKey) {
			throw new Error("RESEND_API_KEY is not set");
		}

		if (!from) {
			throw new Error("RESEND_FROM_EMAIL is not set");
		}

		this.resend = new Resend(apiKey);
		this.from = from;
	}

	async sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
		const { error } = await this.resend.emails.send({
			from: this.from,
			to,
			subject,
			html,
		});

		if (error) {
			throw new Error(`Failed to send email: ${error.message}`);
		}
	}
}
