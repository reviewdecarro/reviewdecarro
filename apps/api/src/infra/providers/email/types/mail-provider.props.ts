export interface MailContactProps {
	name: string;
	email: string;
}

export interface TemplateVariablesProps {
	title: string;
	message: string;
	label: string | "none";
	link?: string;
}

export interface GenerateMailTemplateFromHTMLProps {
	fileName?: string;
	variables: TemplateVariablesProps;
}

export interface SendMailServiceDataProps {
	subject: string;

	to: MailContactProps[] | MailContactProps;

	from?: MailContactProps;

	templateFileName?: string;

	templateVariables: TemplateVariablesProps;
}

export abstract class MailProviderProps {
	abstract execute(data: SendMailServiceDataProps): Promise<void>;
}
