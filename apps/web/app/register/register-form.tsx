"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type InterestId =
	| "sedan"
	| "suv"
	| "pickup"
	| "ev"
	| "sport"
	| "hatch"
	| "luxury"
	| "classic";

type RegisterErrors = Partial<
	Record<"name" | "email" | "username" | "password", string>
>;

const segments: ReadonlyArray<{ id: InterestId; label: string; icon: string }> =
	[
		{ id: "sedan", label: "Sedans", icon: "🚗" },
		{ id: "suv", label: "SUVs", icon: "🚙" },
		{ id: "pickup", label: "Pickups", icon: "🛻" },
		{ id: "ev", label: "EVs", icon: "⚡" },
		{ id: "sport", label: "Sports", icon: "🏎️" },
		{ id: "hatch", label: "Hatchbacks", icon: "🚘" },
		{ id: "luxury", label: "Luxury", icon: "💎" },
		{ id: "classic", label: "Classics", icon: "🏆" },
	];

export function RegisterForm() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [interests, setInterests] = useState<InterestId[]>([]);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<RegisterErrors>({});

	function toggleInterest(id: InterestId) {
		setInterests((prev) =>
			prev.includes(id)
				? prev.filter((interest) => interest !== id)
				: [...prev, id],
		);
	}

	function validateStep1() {
		const nextErrors: RegisterErrors = {};

		if (!name.trim()) nextErrors.name = "Name is required.";
		if (!username.trim()) nextErrors.username = "Username is required.";
		if (!email.includes("@")) nextErrors.email = "Enter a valid email.";
		if (password.length < 8)
			nextErrors.password = "Password must be at least 8 characters.";

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}

	function handleStep1(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (validateStep1()) {
			setStep(2);
		}
	}

	function handleFinish(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		window.setTimeout(() => {
			setLoading(false);
			router.push("/");
		}, 1400);
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
	const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"] as const;

	return (
		<div className="w-full max-w-[440px]">
			<div className="mb-8 text-center">
				<h1
					className="font-display font-extrabold text-[30px] mb-2"
					style={{ color: "var(--text)" }}
				>
					Create your account
				</h1>
				<p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
					It&apos;s free. No credit card needed.
				</p>
			</div>

			<div className="flex items-center gap-2 mb-8">
				{[1, 2].map((n) => (
					<div
						key={n}
						className="h-1 rounded-full flex-1 transition-all duration-300"
						style={{ background: step >= n ? "var(--accent)" : "var(--border)" }}
					/>
				))}
			</div>

			{step === 1 && (
				<form onSubmit={handleStep1}>
					<div className="grid grid-cols-2 gap-3 mb-4">
						<div>
							<label
								className="block text-[13px] font-medium mb-1.5"
								style={{ color: "var(--text-muted)" }}
							>
								Full name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="João Silva"
								className="w-full rounded-xl px-3.5 py-3 text-[14px] border outline-none"
								style={{
									background: "var(--surface)",
									borderColor: errors.name ? "oklch(0.60 0.17 28)" : "var(--border)",
									color: "var(--text)",
								}}
								onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
								onBlur={(e) =>
									(e.target.style.borderColor = errors.name
										? "oklch(0.60 0.17 28)"
										: "var(--border)")
								}
							/>
							{errors.name && (
								<p className="text-[11px] mt-1" style={{ color: "oklch(0.55 0.17 28)" }}>
									{errors.name}
								</p>
							)}
						</div>
						<div>
							<label
								className="block text-[13px] font-medium mb-1.5"
								style={{ color: "var(--text-muted)" }}
							>
								Username
							</label>
							<div className="relative">
								<span
									className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px]"
									style={{ color: "var(--text-light)" }}
								>
									@
								</span>
								<input
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
								<p className="text-[11px] mt-1" style={{ color: "oklch(0.55 0.17 28)" }}>
									{errors.username}
								</p>
							)}
						</div>
					</div>

					<div className="mb-4">
						<label
							className="block text-[13px] font-medium mb-1.5"
							style={{ color: "var(--text-muted)" }}
						>
							Email
						</label>
						<div className="relative">
							<div
								className="absolute left-3.5 top-1/2 -translate-y-1/2"
								style={{ color: "var(--text-light)" }}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="w-full rounded-xl pl-10 pr-4 py-3 text-[14px] border outline-none"
								style={{
									background: "var(--surface)",
									borderColor: errors.email ? "oklch(0.60 0.17 28)" : "var(--border)",
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
							<p className="text-[11px] mt-1" style={{ color: "oklch(0.55 0.17 28)" }}>
								{errors.email}
							</p>
						)}
					</div>

					<div className="mb-6">
						<label
							className="block text-[13px] font-medium mb-1.5"
							style={{ color: "var(--text-muted)" }}
						>
							Password
						</label>
						<div className="relative">
							<div
								className="absolute left-3.5 top-1/2 -translate-y-1/2"
								style={{ color: "var(--text-light)" }}
							>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
								type={showPass ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Min. 8 characters"
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
													strength >= n ? strengthColors[strength] : "var(--border)",
											}}
										/>
									))}
								</div>
								<span className="text-[11px]" style={{ color: strengthColors[strength] }}>
									{strengthLabels[strength]}
								</span>
							</div>
						)}
						{errors.password && (
							<p className="text-[11px] mt-1" style={{ color: "oklch(0.55 0.17 28)" }}>
								{errors.password}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full py-3 rounded-xl text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200"
						style={{ background: "var(--accent)" }}
					>
						Continue →
					</button>
				</form>
			)}

			{step === 2 && (
				<form onSubmit={handleFinish}>
					<div className="mb-8">
						<h1
							className="font-display font-extrabold text-[30px] mb-2"
							style={{ color: "var(--text)" }}
						>
							What are you into?
						</h1>
						<p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
							Pick your interests — we&apos;ll personalise your feed.
						</p>
					</div>

					<div className="grid grid-cols-4 gap-3 mb-8">
						{segments.map((segment) => {
							const active = interests.includes(segment.id);

							return (
								<button
									key={segment.id}
									type="button"
									onClick={() => toggleInterest(segment.id)}
									className="flex flex-col items-center gap-2 py-4 rounded-xl border cursor-pointer transition-all duration-150"
									style={{
										background: active ? "var(--accent-light)" : "var(--surface)",
										borderColor: active ? "var(--accent)" : "var(--border)",
									}}
								>
									<span className="text-[22px] leading-none">{segment.icon}</span>
									<span
										className="text-[12px] font-medium"
										style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
									>
										{segment.label}
									</span>
								</button>
							);
						})}
					</div>

					{interests.length < 1 && (
						<p
							className="text-[13px] text-center mb-4"
							style={{ color: "var(--text-light)" }}
						>
							Select at least one to continue
						</p>
					)}

					<button
						type="submit"
						disabled={loading || interests.length < 1}
						className="w-full py-3 rounded-xl text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
						style={{
							background:
								loading || interests.length < 1
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
								Creating your account…
							</>
						) : (
							`Create account (${interests.length} selected)`
						)}
					</button>

					<button
						type="button"
						onClick={() => setStep(1)}
						className="w-full mt-3 py-2.5 rounded-xl text-[14px] font-medium border-none bg-transparent cursor-pointer"
						style={{ color: "var(--text-muted)" }}
					>
						← Back
					</button>
				</form>
			)}

			<p className="text-center mt-4 text-[12px]" style={{ color: "var(--text-light)" }}>
				By creating an account you agree to our{" "}
				<span className="cursor-pointer" style={{ color: "var(--accent)" }}>
					Terms
				</span>{" "}
				and{" "}
				<span className="cursor-pointer" style={{ color: "var(--accent)" }}>
					Privacy Policy
				</span>
				.
			</p>
		</div>
	);
}
