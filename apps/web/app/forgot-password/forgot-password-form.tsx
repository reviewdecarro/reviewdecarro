"use client";

import { LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

type ForgotPasswordResponse = {
	message?: string;
};

export function ForgotPasswordForm() {
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [confirmedEmail, setConfirmedEmail] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!email.includes("@")) {
			setError("Digite um e-mail válido.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/users/forgot-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				},
			);

			const data = (await response.json()) as ForgotPasswordResponse;

			if (!response.ok) {
				throw new Error(
					data.message ??
						"Não foi possível enviar o e-mail de redefinição.",
				);
			}

			setConfirmedEmail(email);
			setSuccessMessage(
				data.message ??
					"Se o e-mail estiver cadastrado, você receberá um link para redefinição.",
			);
			setStep(2);
			setEmail("");
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Não foi possível enviar o e-mail de redefinição.",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full max-w-[440px]">
			<div className="mb-8 text-center">
				<h1
					className="font-display font-extrabold text-[30px] mb-2"
					style={{ color: "var(--text)" }}
				>
					Redefinir senha
				</h1>
				<p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
					Informe o e-mail da sua conta para receber o link de redefinição.
				</p>
			</div>

			{step === 1 ? (
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
							htmlFor="forgot-password-email"
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
								id="forgot-password-email"
								type="email"
								autoComplete="email"
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

					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 rounded-xl text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
						style={{
							background: loading ? "oklch(0.68 0.10 38)" : "var(--accent)",
						}}
					>
						{loading ? (
							<>
								<LoaderCircle className="animate-spin" size={16} strokeWidth={2} />
								Enviando link…
							</>
						) : (
							"Enviar link"
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
						Verifique seu e-mail.
					</p>
					<p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
						{successMessage}
					</p>
					<p className="mt-3 text-[14px]" style={{ color: "var(--text-muted)" }}>
						O e-mail informado foi{" "}
						<span className="font-semibold" style={{ color: "var(--text)" }}>
							{confirmedEmail}
						</span>
						.
					</p>
					<Link
						href="/login"
						className="mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold text-white"
						style={{ background: "var(--accent)" }}
					>
						Voltar para entrar
					</Link>
				</div>
			)}
		</div>
	);
}
