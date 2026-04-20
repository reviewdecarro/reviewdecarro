import { Injectable, Logger } from "@nestjs/common";
import {
	EmailProviderProps,
	SendEmailParams,
} from "./types/email-provider.props";

@Injectable()
export class LogEmailProvider implements EmailProviderProps {
	private logger = new Logger(LogEmailProvider.name);

	async sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
		this.logger.log(`To: ${to} | Subject: ${subject}\n${html}`);
	}
}
