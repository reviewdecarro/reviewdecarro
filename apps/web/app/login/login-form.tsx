"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (submitTimerRef.current !== null) {
				clearTimeout(submitTimerRef.current);
			}
		};
	}, []);

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!email || !password) {
			setError("Preencha todos os campos.");
			return;
		}

		setError("");
		setLoading(true);

		if (submitTimerRef.current !== null) {
			clearTimeout(submitTimerRef.current);
		}

		submitTimerRef.current = setTimeout(() => {
			setLoading(false);
			router.push("/");
		}, 1200);
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
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<title>E-mail</title>
								<rect
									x="1"
									y="3"
									width="14"
									height="10"
									rx="2"
									stroke="currentColor"
									strokeWidth="1.4"
								/>
								<path
									d="M1 5.5L8 9.5L15 5.5"
									stroke="currentColor"
									strokeWidth="1.4"
								/>
							</svg>
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
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<title>Senha</title>
								<rect
									x="3"
									y="7"
									width="10"
									height="7"
									rx="2"
									stroke="currentColor"
									strokeWidth="1.4"
								/>
								<path
									d="M5 7V5a3 3 0 0 1 6 0v2"
									stroke="currentColor"
									strokeWidth="1.4"
									strokeLinecap="round"
								/>
							</svg>
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
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<title>Ocultar senha</title>
									<path
										d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
										stroke="currentColor"
										strokeWidth="1.4"
									/>
									<circle
										cx="8"
										cy="8"
										r="2"
										stroke="currentColor"
										strokeWidth="1.4"
									/>
									<path
										d="M2 2L14 14"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
									/>
								</svg>
							) : (
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<title>Mostrar senha</title>
									<path
										d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
										stroke="currentColor"
										strokeWidth="1.4"
									/>
									<circle
										cx="8"
										cy="8"
										r="2"
										stroke="currentColor"
										strokeWidth="1.4"
									/>
								</svg>
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
							<svg
								className="animate-spin"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<title>Carregando</title>
								<circle
									cx="8"
									cy="8"
									r="6"
									stroke="white"
									strokeWidth="2"
									strokeOpacity="0.3"
								/>
								<path
									d="M8 2a6 6 0 0 1 6 6"
									stroke="white"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
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
