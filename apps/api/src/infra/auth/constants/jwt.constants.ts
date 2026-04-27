export const jwtConstants = {
	secret: process.env.JWT_SECRET || "default-secret-change-me",
	expiresIn: "15m" as const,
};
