"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { label: string; href: string };

const links: NavLink[] = [
	{ label: "Home", href: "/" },
	{ label: "Reviews", href: "/reviews" },
	{ label: "Cars", href: "/cars" },
	{ label: "Forum", href: "/forum" },
];

export function Nav() {
	const pathname = usePathname();

	function isActive(href: string) {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	}

	return (
		<nav
			className="sticky top-0 z-50 border-b"
			style={{
				background: "var(--bg)",
				borderColor: "var(--border)",
				height: 56,
			}}
		>
			<div className="max-w-[1100px] mx-auto px-6 h-full flex items-center">
				<Link href="/" className="flex items-center gap-2.5 mr-8">
					<div
						className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
						style={{ background: "var(--accent)" }}
					>
						<svg width="18" height="14" viewBox="0 0 18 14" fill="none">
							<title>Página Home</title>
							<path
								d="M2.5 10L5 3H13L15.5 10H2.5Z"
								fill="white"
								opacity="0.95"
							/>
							<circle cx="5" cy="12" r="2" fill="white" />
							<circle cx="13" cy="12" r="2" fill="white" />
							<rect
								x="1"
								y="9"
								width="16"
								height="1.5"
								rx="0.75"
								fill="white"
								opacity="0.5"
							/>
						</svg>
					</div>
					<span
						className="font-display font-extrabold text-[19px] tracking-tight"
						style={{ color: "var(--text)" }}
					>
						PapoAuto
					</span>
				</Link>

				<div className="flex flex-1">
					{links.map((l) => {
						const active = isActive(l.href);
						return (
							<Link
								key={l.href}
								href={l.href}
								className="flex items-center h-[56px] px-3 text-[14px] font-medium transition-colors duration-150"
								style={{
									color: active ? "var(--accent)" : "var(--text-muted)",
									borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
									borderRadius: "6px 6px 0 0",
								}}
							>
								{l.label}
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-2.5">
					<button
						className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[13px] cursor-pointer"
						style={{
							background: "var(--surface-2)",
							borderColor: "var(--border)",
							color: "var(--text-muted)",
						}}
						type="button"
						>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
							<title>Buscar</title>
							<circle
								cx="6"
								cy="6"
								r="4.5"
								stroke="currentColor"
								strokeWidth="1.4"
							/>
							<path
								d="M10 10L13 13"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
							/>
						</svg>
						Buscar
						<span className="text-[11px] opacity-50 font-mono ml-0.5">⌘K</span>
					</button>
					<Link
						href="/register"
						className="px-4 py-1.5 rounded-lg border text-[13px] font-medium cursor-pointer"
						style={{
							background: "var(--surface-2)",
							borderColor: "var(--border)",
							color: "var(--text-muted)",
						}}
					>
						Cadastrar
					</Link>
					<Link
						href="/login"
						className="px-4 py-1.5 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer"
						style={{ background: "var(--accent)" }}
					>
						Sign in
					</Link>
				</div>
			</div>
		</nav>
	);
}
