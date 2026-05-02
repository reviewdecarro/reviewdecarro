"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";

type RegisterErrors = Partial<
	Record<"email" | "username" | "password", string>
>;

type RegisterResponse = {
	message?: string;
};

export function RegisterForm() {
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<RegisterErrors>({});
	const [confirmedEmail, setConfirmedEmail] = useState("");
	const [submitError, setSubmitError] = useState("");

	function validateStep1() {
		const nextErrors: RegisterErrors = {};

		if (!username.trim())
			nextErrors.username = "O nome de usuário é obrigatório.";
		if (!email.includes("@")) nextErrors.email = "Digite um e-mail válido.";
		if (password.length < 8)
			nextErrors.password = "A senha precisa ter pelo menos 8 caracteres.";

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!validateStep1() || !acceptedTerms) {
			if (!acceptedTerms) {
				setSubmitError("Você precisa concordar com os termos para continuar.");
			}
			return;
		}

		setLoading(true);
		setSubmitError("");

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/users/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username,
						email,
						password,
					}),
				},
			);

			const data = (await response.json()) as RegisterResponse;

			if (!response.ok) {
				throw new Error(
					data.message ?? "Não foi possível concluir o cadastro.",
				);
			}

			setConfirmedEmail(email);
			setStep(2);
			setUsername("");
			setEmail("");
			setPassword("");
			setAcceptedTerms(false);
			setShowPass(false);
			setErrors({});
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: "Não foi possível concluir o cadastro.",
			);
		} finally {
			setLoading(false);
		}
	}

	const strength =
		password.length === 0
			? 0
			: password.length < 6
				? 1
				: password.length < 10
					? 2
					: /[A-Z]/.test(password) && /[0-9]/.test(password)
						? 4
						: 3;
	const strengthColors = [
		"transparent",
		"oklch(0.60 0.17 28)",
		"oklch(0.65 0.16 78)",
		"oklch(0.60 0.15 165)",
		"oklch(0.57 0.17 148)",
	] as const;
	const strengthLabels = ["", "Fraca", "Razoável", "Boa", "Forte"] as const;

	return (
		<div className="w-full max-w-[440px]">
			<div className="mb-8 text-center">
				<h1
					className="font-display font-extrabold text-[30px] mb-2"
					style={{ color: "var(--text)" }}
				>
					Cadastro
				</h1>
			</div>

			{submitError && (
				<div
					className="mb-4 rounded-xl border px-4 py-3 text-[13px]"
					style={{
						background: "oklch(0.97 0.04 25)",
						borderColor: "oklch(0.88 0.08 25)",
						color: "oklch(0.45 0.17 25)",
					}}
				>
					{submitError}
				</div>
			)}

			{step === 1 ? (
				<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						className="block text-[13px] font-medium mb-1.5"
						style={{ color: "var(--text-muted)" }}
						htmlFor="register-username"
					>
						Nome de usuário
					</label>
					<div className="relative">
						<span
							className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px]"
							style={{ color: "var(--text-light)" }}
						>
							@
						</span>
						<input
							id="register-username"
							type="text"
							value={username}
							onChange={(e) =>
								setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
							}
							placeholder="joaosilva"
							className="w-full rounded-xl pl-7 pr-3.5 py-3 text-[14px] border outline-none"
							style={{
								background: "var(--surface)",
								borderColor: errors.username
									? "oklch(0.60 0.17 28)"
									: "var(--border)",
								color: "var(--text)",
							}}
							onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
							onBlur={(e) =>
								(e.target.style.borderColor = errors.username
									? "oklch(0.60 0.17 28)"
									: "var(--border)")
							}
						/>
					</div>
					{errors.username && (
						<p
							className="text-[11px] mt-1"
							style={{ color: "oklch(0.55 0.17 28)" }}
						>
							{errors.username}
						</p>
					)}
				</div>

				<div className="mb-4">
					<label
						className="block text-[13px] font-medium mb-1.5"
						style={{ color: "var(--text-muted)" }}
						htmlFor="register-email"
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
							id="register-email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="voce@exemplo.com"
							className="w-full rounded-xl pl-10 pr-4 py-3 text-[14px] border outline-none"
							style={{
								background: "var(--surface)",
								borderColor: errors.email
									? "oklch(0.60 0.17 28)"
									: "var(--border)",
								color: "var(--text)",
							}}
							onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
							onBlur={(e) =>
								(e.target.style.borderColor = errors.email
									? "oklch(0.60 0.17 28)"
									: "var(--border)")
							}
						/>
					</div>
					{errors.email && (
						<p
							className="text-[11px] mt-1"
							style={{ color: "oklch(0.55 0.17 28)" }}
						>
							{errors.email}
						</p>
					)}
				</div>

				<div className="mb-4">
					<label
						className="block text-[13px] font-medium mb-1.5"
						style={{ color: "var(--text-muted)" }}
						htmlFor="register-password"
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
							id="register-password"
							type={showPass ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Mín. 8 caracteres"
							className="w-full rounded-xl pl-10 pr-10 py-3 text-[14px] border outline-none"
							style={{
								background: "var(--surface)",
								borderColor: errors.password
									? "oklch(0.60 0.17 28)"
									: "var(--border)",
								color: "var(--text)",
							}}
							onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
							onBlur={(e) =>
								(e.target.style.borderColor = errors.password
									? "oklch(0.60 0.17 28)"
									: "var(--border)")
							}
						/>
						<button
							type="button"
							onClick={() => setShowPass((v) => !v)}
							className="absolute right-3.5 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
							style={{ color: "var(--text-light)" }}
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<title>{showPass ? "Ocultar senha" : "Mostrar senha"}</title>
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
						</button>
					</div>
					{password.length > 0 && (
						<div className="mt-2">
							<div className="flex gap-1 mb-1">
								{[1, 2, 3, 4].map((n) => (
									<div
										key={n}
										className="flex-1 h-1 rounded-full transition-all duration-300"
										style={{
											background:
												strength >= n
													? strengthColors[strength]
													: "var(--border)",
										}}
									/>
								))}
							</div>
							<span
								className="text-[11px]"
								style={{ color: strengthColors[strength] }}
							>
								{strengthLabels[strength]}
							</span>
						</div>
					)}
					{errors.password && (
						<p
							className="text-[11px] mt-1"
							style={{ color: "oklch(0.55 0.17 28)" }}
						>
							{errors.password}
						</p>
					)}
				</div>

				<div className="flex items-start gap-3 mb-4">
					<input
						id="register-terms"
						type="checkbox"
						checked={acceptedTerms}
						onChange={(e) => setAcceptedTerms(e.target.checked)}
						className="mt-1 h-4 w-4 rounded border"
						style={{
							accentColor: "var(--accent)",
							borderColor: "var(--border)",
						}}
					/>
					<label
						htmlFor="register-terms"
						className="text-[13px] leading-relaxed"
						style={{ color: "var(--text-muted)" }}
					>
						Li e estou de acordo com os{" "}
						<span className="font-semibold" style={{ color: "var(--text)" }}>
							Termos de uso
						</span>
						.
					</label>
				</div>

				<button
					type="submit"
					disabled={loading || !acceptedTerms}
					className="w-full py-3 rounded-xl text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
					style={{
						background:
							loading || !acceptedTerms
								? "oklch(0.68 0.10 38)"
								: "var(--accent)",
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
							Criando sua conta…
						</>
					) : (
						"Criar conta"
					)}
				</button>
				</form>
			) : (
				<div
					className="rounded-2xl border px-5 py-6"
					style={{
						background: "var(--surface)",
						borderColor: "var(--border)",
					}}
				>
					<p
						className="text-[20px] font-display font-extrabold leading-tight mb-3"
						style={{ color: "var(--text)" }}
					>
						Usuário cadastrado com sucesso.
					</p>
					<p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
						Um e-mail de confirmação foi enviado para o e-mail{" "}
						<span className="font-semibold" style={{ color: "var(--text)" }}>
							{confirmedEmail}
						</span>
						.
					</p>
					<Link
						href="/"
						className="mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold text-white"
						style={{ background: "var(--accent)" }}
					>
						Voltar para o início
					</Link>
				</div>
			)}
		</div>
	);
}
