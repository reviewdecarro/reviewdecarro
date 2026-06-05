import { promises as fs } from "node:fs";
import { join } from "node:path";
import { Injectable } from "@nestjs/common";
import { GenerateMailTemplateFromHTMLProps } from "./types/mail-provider.props";

@Injectable()
export class GenerateMailTemplateFromHTMLService {
	public execute = async ({
		fileName = "mail.html",
		variables,
	}: GenerateMailTemplateFromHTMLProps): Promise<string> => {
		const file = join(__dirname, "../../../../templates", fileName);

		let templateContent = await fs.readFile(file, {
			encoding: "utf-8",
		});

		for (const [key, value] of Object.entries(variables)) {
			const regex = new RegExp(`{${key}}`, "g");

			templateContent = templateContent.replace(regex, String(value));
		}
		return templateContent;
	};
}
