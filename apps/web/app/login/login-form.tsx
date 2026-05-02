"use client";

import { Eye, EyeOff, Lock, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { useAuthSession } from "@/hooks/use-auth-session";

type LoginResponse = {
	message?: string;
	user?: {
		username: string;
		email: string;
	};
};

export function LoginForm() {
	const router = useRouter();
	const { storeAuthUser } = useAuthSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!email || !password) {
			setError("Preencha todos os campos.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/login`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
					}),
				},
			);

			const data = (await response.json()) as LoginResponse;

			if (!response.ok) {
				throw new Error(data.message ?? "E-mail ou senha inválidos.");
			}

			if (!data.user) {
				throw new Error("Resposta de autenticação incompleta.");
			}

			storeAuthUser(data.user);

			router.push("/");
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "E-mail ou senha inválidos.",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full max-w-[420px]">
			<div className="mb-8 text-center">
				<h1
					className="font-display font-extrabold text-[30px] mb-2"
					style={{ color: "var(--text)" }}
				>
					Bem-vindo de volta
				</h1>
				<p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
					Entre na sua conta para continuar.
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				{error && (
					<div
						className="rounded-xl px-4 py-3 mb-4 text-[13px] border"
						style={{
							background: "oklch(0.97 0.04 25)",
							borderColor: "oklch(0.88 0.08 25)",
							color: "oklch(0.45 0.17 25)",
						}}
					>
						{error}
					</div>
				)}

				<div className="mb-4">
					<label
						className="block text-[13px] font-medium mb-1.5"
						style={{ color: "var(--text-muted)" }}
						htmlFor="email"
					>
						E-mail
					</label>
					<div className="relative">
						<div
							className="absolute left-3.5 top-1/2 -translate-y-1/2"
							style={{ color: "var(--text-light)" }}
						>
							<Mail size={16} strokeWidth={1.8} />
						</div>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="voce@exemplo.com"
							className="w-full rounded-xl pl-10 pr-4 py-3 text-[14px] border outline-none transition-colors duration-150"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
							onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
							onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
						/>
					</div>
				</div>

				<div className="mb-2">
					<label
						className="block text-[13px] font-medium mb-1.5"
						style={{ color: "var(--text-muted)" }}
						htmlFor="password"
					>
						Senha
					</label>
					<div className="relative">
						<div
							className="absolute left-3.5 top-1/2 -translate-y-1/2"
							style={{ color: "var(--text-light)" }}
						>
							<Lock size={16} strokeWidth={1.8} />
						</div>
						<input
							id="password"
							type={showPass ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="w-full rounded-xl pl-10 pr-10 py-3 text-[14px] border outline-none transition-colors duration-150"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
							onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
							onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
						/>
						<button
							type="button"
							onClick={() => setShowPass((v) => !v)}
							className="absolute right-3.5 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
							style={{ color: "var(--text-light)" }}
						>
							{showPass ? (
								<EyeOff size={16} strokeWidth={1.8} />
							) : (
								<Eye size={16} strokeWidth={1.8} />
							)}
						</button>
					</div>
				</div>

				<Link
					href="/forgot-password"
					className="text-[12px] border-none bg-transparent cursor-pointer inline-flex"
					style={{ color: "var(--accent)" }}
				>
					Esqueceu a senha?
				</Link>

				<button
					type="submit"
					disabled={loading}
					className="mt-6 w-full py-3 rounded-xl text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
					style={{
						background: loading ? "oklch(0.68 0.10 38)" : "var(--accent)",
					}}
				>
						{loading ? (
							<>
								<LoaderCircle className="animate-spin" size={16} strokeWidth={2} />
							Entrando…
						</>
					) : (
						"Entrar"
					)}
				</button>
			</form>

			<p
				className="text-center mt-6 text-[14px]"
				style={{ color: "var(--text-muted)" }}
			>
				Não tem uma conta?{" "}
				<Link
					href="/register"
					className="font-semibold border-none bg-transparent cursor-pointer text-[14px]"
					style={{ color: "var(--accent)" }}
				>
					Criar uma
				</Link>
			</p>
		</div>
	);
}
