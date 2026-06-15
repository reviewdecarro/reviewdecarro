"use client";

import { Menu, Search, Settings, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/api/api";
import { useAuthSession } from "@/hooks/use-auth-session";

type NavLink = { label: string; href: string };

const links: NavLink[] = [
	{ label: "Início", href: "/" },
	{ label: "Avaliações", href: "/reviews" },
	{ label: "Fórum", href: "/forum" },
];

export function Nav() {
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);
	const { authUser, isLoggedIn, removeAuthUser } = useAuthSession();
	const accountMenuRef = useRef<HTMLDivElement | null>(null);

	function isActive(href: string) {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	}

	useEffect(() => {
		function handleOutsideClick(event: MouseEvent) {
			if (
				accountMenuRef.current &&
				!accountMenuRef.current.contains(event.target as Node)
			) {
				setAccountMenuOpen(false);
			}
		}

		if (!accountMenuOpen) return;

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [accountMenuOpen]);

	async function handleLogout() {
		try {
			await fetch(`${API_BASE_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch {
			// Clear local session even if the API request fails.
		}

		removeAuthUser();
		setAccountMenuOpen(false);
		setMobileMenuOpen(false);
		router.push("/");
	}

	return (
		<nav
			className="sticky top-0 z-50 border-b"
			style={{
				background: "var(--header-background)",
				borderColor: "var(--nav-border)",
			}}
		>
			<div className="container mx-auto px-6 py-2">
				<div className="flex items-center justify-between gap-8">
					<Link href="/" className="flex items-center min-w-0">
						<Image
							src="/logos/papo-auto-logo-color.svg"
							alt="PapoAuto"
							width={140}
							height={40}
							className="h-10 w-auto shrink-0"
							priority
						/>
					</Link>

					<div className="hidden sm:flex flex-1 items-center gap-9">
						{links.map((l) => {
							const active = isActive(l.href);
							return (
								<Link
									key={l.href}
									href={l.href}
									className="flex h-[56px] items-center text-[16px] font-semibold transition-colors duration-150"
									style={{
										color: active
											? "var(--nav-text-active)"
											: "var(--nav-text)",
									}}
								>
									{l.label}
								</Link>
							);
						})}
					</div>

					<div className="hidden sm:flex items-center gap-8">
						{/* <button
							className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[13px] cursor-pointer"
							style={{
								background: "var(--surface-2)",
								borderColor: "var(--border)",
								color: "var(--text-muted)",
							}}
							type="button"
						>
							<Search size={14} strokeWidth={1.8} />
							Buscar
							<span className="text-[11px] opacity-50 font-mono ml-0.5">
								⌘K
							</span>
						</button> */}

						{isLoggedIn && authUser ? (
							<div className="relative" ref={accountMenuRef}>
								<button
									type="button"
									aria-label={
										accountMenuOpen
											? "Fechar menu da conta"
											: "Abrir menu da conta"
									}
									aria-expanded={accountMenuOpen}
									className="inline-flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer"
									style={{
										background: "var(--nav-control-bg)",
										borderColor: "var(--nav-control-border)",
										color: "var(--nav-text)",
									}}
									onClick={() => setAccountMenuOpen((value) => !value)}
								>
									<Menu size={18} strokeWidth={1.8} />
								</button>

								{accountMenuOpen && (
									<div
										className="absolute right-0 top-full mt-2 w-64 rounded-2xl border p-2 shadow-sm"
										style={{
											background: "var(--bg)",
											borderColor: "var(--border)",
										}}
									>
										<div className="flex items-center gap-2 rounded-xl px-3 py-2">
											<span style={{ color: "var(--accent)" }}>
												<UserRound size={14} strokeWidth={1.8} />
											</span>
											<span
												className="min-w-0 truncate text-[14px] font-semibold"
												style={{ color: "var(--text)" }}
											>
												{authUser.username}
											</span>
										</div>
										<Link
											href="/profile"
											onClick={() => setAccountMenuOpen(false)}
											className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-medium"
											style={{
												color: "var(--text-muted)",
												background: "var(--surface)",
											}}
										>
											<span style={{ color: "var(--accent)" }}>
												<Settings size={14} strokeWidth={1.8} />
											</span>
											Editar perfil
										</Link>
										<button
											type="button"
											onClick={handleLogout}
											className="cursor-pointer mt-2 flex w-full items-center justify-center rounded-xl px-3 py-2 text-[14px] font-medium"
											style={{
												background: "var(--surface-2)",
												border: "1px solid var(--border)",
												color: "var(--text-muted)",
											}}
										>
											Sair
										</button>
									</div>
								)}
							</div>
						) : (
							<>
								<Link
									href="/register"
									className="text-[16px] font-semibold cursor-pointer transition-colors duration-150"
									style={{
										color: "var(--nav-text)",
									}}
								>
									Cadastrar
								</Link>
								<Link
									href="/login"
									className="rounded-xl px-6 py-2 text-[16px] font-semibold text-white shadow-sm transition-all duration-150 cursor-pointer hover:brightness-90"
									style={{ background: "var(--accent)" }}
								>
									Entrar
								</Link>
							</>
						)}
					</div>

					<button
						type="button"
						className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border"
						style={{
							background: "var(--nav-control-bg)",
							borderColor: "var(--nav-control-border)",
							color: "var(--nav-text)",
						}}
						aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
						aria-expanded={mobileMenuOpen}
						aria-controls="mobile-nav-menu"
						onClick={() => setMobileMenuOpen((v) => !v)}
					>
						{mobileMenuOpen ? (
							<X size={18} strokeWidth={1.8} />
						) : (
							<Menu size={18} strokeWidth={1.8} />
						)}
					</button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div
					id="mobile-nav-menu"
					className="sm:hidden border-t"
					style={{
						background: "var(--bg)",
						borderColor: "var(--border)",
					}}
				>
					<div className="max-w-[1100px] mx-auto px-4 py-3 flex flex-col gap-2">
						{links.map((l) => {
							const active = isActive(l.href);
							return (
								<Link
									key={l.href}
									href={l.href}
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center justify-between rounded-lg px-3 py-2 text-[14px] font-medium"
									style={{
										background: active
											? "var(--accent-tint)"
											: "var(--surface)",
										color: active ? "var(--accent)" : "var(--text-muted)",
										border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
									}}
								>
									{l.label}
								</Link>
							);
						})}

						{isLoggedIn && authUser && (
							<div
								className="rounded-2xl border p-3 mt-2"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<div className="flex items-center gap-2 mb-2">
									<span style={{ color: "var(--accent)" }}>
										<UserRound size={14} strokeWidth={1.8} />
									</span>
									<span
										className="min-w-0 truncate text-[14px] font-semibold"
										style={{ color: "var(--text)" }}
									>
										{authUser.username}
									</span>
								</div>
								<Link
									href="/profile"
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-medium"
									style={{
										background: "var(--surface-2)",
										color: "var(--text-muted)",
									}}
								>
									<span style={{ color: "var(--accent)" }}>
										<Settings size={14} strokeWidth={1.8} />
									</span>
									Editar perfil
								</Link>
								<button
									type="button"
									onClick={handleLogout}
									className="mt-2 flex w-full items-center justify-center rounded-xl px-3 py-2 text-[14px] font-medium"
									style={{
										background: "var(--surface-2)",
										border: "1px solid var(--border)",
										color: "var(--text-muted)",
									}}
								>
									Sair
								</button>
							</div>
						)}

						<div className="grid grid-cols-2 gap-2 pt-2">
							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[13px]"
								style={{
									background: "var(--surface-2)",
									borderColor: "var(--border)",
									color: "var(--text-muted)",
								}}
							>
								<Search size={14} strokeWidth={1.8} />
								Buscar
							</button>
							{isLoggedIn ? (
								<Link
									href="/profile"
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold"
									style={{
										background: "var(--surface-2)",
										borderColor: "var(--border)",
										color: "var(--text-muted)",
									}}
								>
									<Settings size={14} strokeWidth={1.8} />
									Editar perfil
								</Link>
							) : (
								<Link
									href="/login"
									onClick={() => setMobileMenuOpen(false)}
									className="flex items-center justify-center rounded-lg border-none px-3 py-2 text-[13px] font-semibold text-white transition-all hover:brightness-90"
									style={{ background: "var(--accent)" }}
								>
									Entrar
								</Link>
							)}
						</div>

						{!isLoggedIn && (
							<Link
								href="/register"
								onClick={() => setMobileMenuOpen(false)}
								className="flex items-center justify-center rounded-lg border px-3 py-2 text-[13px] font-medium"
								style={{
									background: "var(--surface-2)",
									borderColor: "var(--border)",
									color: "var(--text-muted)",
								}}
							>
								Cadastrar
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
