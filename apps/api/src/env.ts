import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
	API_PORT: z.string().min(1, { message: "Porta da API é obrigatória" }),
	NODE_ENV: z
		.enum(["development", "production", "test"], {
			error: "Ambiente de desenvolvimento inválido",
		})
		.default("development"),
	WHITELIST_REQUESTS: z
		.string()
		.min(1, { message: "Whitelist de requests é obrigatória" }),
	DATABASE_URL: z
		.string()
		.min(1, { message: "URL do banco de dados é obrigatória" }),
	JWT_SECRET: z
		.string()
		.min(1, { message: "Chave secreta do JWT é obrigatória" }),
	WEB_EMAIL_CONFIRMATION_BASE_URL: z.url({
		error: "URL de ativação de email é obrigatória",
	}),
	WEB_FORGOT_PASSWORD_URL: z.url({
		error: "URL de recuperação de senha é obrigatória",
	}),
	RESEND_MAIL_KEY: z
		.string()
		.min(1, { message: "Chave de envio de email é obrigatória" }),
	MAIL_SENDER_EMAIL: z.email({ error: "Email do remetente é obrigatório" }),
	MAIL_SENDER_NAME: z
		.string()
		.min(1, { message: "Nome do remetente é obrigatório" }),
	SEED_ADMIN_EMAIL: z.email({
		error: "Email do administrador é obrigatório",
	}),
	SEED_ADMIN_PASSWORD: z
		.string()
		.min(1, { message: "Senha do administrador é obrigatória" }),
	WEB_APP_URL: z.url({ error: "URL base do frontend é obrigatória" }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		"Environment variables",
		JSON.stringify(parsedEnv.error.flatten().fieldErrors),
	);

	// Only exit in non-test environments
	if (process.env.NODE_ENV !== "test") {
		process.exit(1);
	}
}

export const env = parsedEnv.data || ({} as any);
