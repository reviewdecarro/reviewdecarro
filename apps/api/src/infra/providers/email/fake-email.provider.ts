import { Injectable } from "@nestjs/common";
import {
	EmailProviderProps,
	SendEmailParams,
} from "./types/email-provider.props";

@Injectable()
export class FakeEmailProvider implements EmailProviderProps {
	public items: SendEmailParams[] = [];

	async sendEmail(params: SendEmailParams): Promise<void> {
		this.items.push(params);
	}
}
