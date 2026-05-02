"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { API_BASE_URL } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

type AuthSessionContextValue = {
	authUser: AuthUser | null;
	isLoggedIn: boolean;
	isCheckingSession: boolean;
	storeAuthUser(user: AuthUser): void;
	removeAuthUser(): void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
	const [authUser, setAuthUser] = useState<AuthUser | null>(null);
	const [isCheckingSession, setIsCheckingSession] = useState(true);

	useEffect(() => {
		let active = true;

		async function syncSession() {
			try {
				const response = await fetch(`${API_BASE_URL}/auth/me`, {
					credentials: "include",
					cache: "no-store",
				});

				if (response.status === 401) {
					if (active) {
						setAuthUser(null);
					}
					return;
				}

				if (!response.ok) {
					throw new Error("Falha ao validar a sessão.");
				}

				const data = (await response.json()) as {
					user?: { username: string; email: string } | null;
				};

				if (active) {
					setAuthUser(data.user ?? null);
				}
			} catch {
				if (active) {
					setAuthUser(null);
				}
			} finally {
				if (active) {
					setIsCheckingSession(false);
				}
			}
		}

		void syncSession();

		return () => {
			active = false;
		};
	}, []);

	const value = useMemo<AuthSessionContextValue>(
		() => ({
			authUser,
			isLoggedIn: Boolean(authUser),
			isCheckingSession,
			storeAuthUser(user: AuthUser) {
				setAuthUser(user);
			},
			removeAuthUser() {
				setAuthUser(null);
			},
		}),
		[authUser, isCheckingSession],
	);

	return (
		<AuthSessionContext.Provider value={value}>
			{children}
		</AuthSessionContext.Provider>
	);
}

export function useAuthSession() {
	const context = useContext(AuthSessionContext);

	if (!context) {
		throw new Error("useAuthSession must be used within AuthSessionProvider");
	}

	return context;
}
