export interface SendEmailParams {
	to: string;
	subject: string;
	html: string;
}

export abstract class EmailProviderProps {
	abstract sendEmail(params: SendEmailParams): Promise<void>;
}
