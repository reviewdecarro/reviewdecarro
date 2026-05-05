import type { Response } from "express";

export const authCookieNames = {
	accessToken: "papoauto_access_token",
	refreshToken: "papoauto_refresh_token",
	sessionId: "papoauto_session_id",
} as const;

const isProduction = process.env.NODE_ENV === "production";

const cookieBaseOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: "lax" as const,
	path: "/",
};

export const authCookieOptions = {
	accessToken: {
		...cookieBaseOptions,
		maxAge: 15 * 60 * 1000,
	},
	refreshToken: {
		...cookieBaseOptions,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	},
	sessionId: {
		...cookieBaseOptions,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	},
} as const;

export function setAuthCookies(
	res: Response,
	{
		accessToken,
		refreshToken,
		sessionId,
	}: {
		accessToken: string;
		refreshToken: string;
		sessionId: string;
	},
) {
	res.cookie(
		authCookieNames.accessToken,
		accessToken,
		authCookieOptions.accessToken,
	);
	res.cookie(
		authCookieNames.refreshToken,
		refreshToken,
		authCookieOptions.refreshToken,
	);
	res.cookie(authCookieNames.sessionId, sessionId, authCookieOptions.sessionId);
}

export function clearAuthCookies(res: Response) {
	res.clearCookie(authCookieNames.accessToken, cookieBaseOptions);
	res.clearCookie(authCookieNames.refreshToken, cookieBaseOptions);
	res.clearCookie(authCookieNames.sessionId, cookieBaseOptions);
}

export function parseCookieHeader(header?: string): Record<string, string> {
	if (!header) return {};

	return header.split(";").reduce<Record<string, string>>((acc, part) => {
		const [rawName, ...rawValue] = part.trim().split("=");
		if (!rawName || rawValue.length === 0) return acc;
		acc[decodeURIComponent(rawName)] = decodeURIComponent(rawValue.join("="));
		return acc;
	}, {});
}
