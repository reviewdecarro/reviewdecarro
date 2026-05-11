import { env } from "src/env";

export const jwtConstants = {
	secret: env.JWT_SECRET || "default-secret-change-me",
	expiresIn: "15m" as const,
};
