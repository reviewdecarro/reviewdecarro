"use client";

import {
	FileText,
	LayoutDashboard,
	LoaderCircle,
	MessageSquare,
	ShieldAlert,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";

const adminNavItems = [
	{ icon: LayoutDashboard, label: "Visão geral", href: "/admin" },
	{ icon: Users, label: "Usuários", href: "/admin/users" },
	{ icon: FileText, label: "Avaliações", href: "/admin/reviews" },
	{ icon: MessageSquare, label: "Fórum", href: "/admin/forum" },
];

export function AdminShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { isAdmin, isCheckingSession } = useAuthSession();

	if (isCheckingSession) {
		return (
			<main className="flex-1" style={{ background: "var(--surface)" }}>
				<div className="container mx-auto px-6 py-10 sm:py-12">
					<div
						className="rounded-xl border p-6 text-[14px]"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
							color: "var(--text-muted)",
						}}
					>
						<LoaderCircle size={16} className="mr-2 inline animate-spin" />
						Validando permissões...
					</div>
				</div>
			</main>
		);
	}

	if (!isAdmin) {
		return (
			<main className="flex-1" style={{ background: "var(--surface)" }}>
				<div className="container mx-auto px-6 py-10 sm:py-12">
					<div
						className="rounded-xl border p-8 text-center"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
						}}
					>
						<div
							className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
							style={{
								background: "var(--accent-tint)",
								color: "var(--accent)",
							}}
						>
							<ShieldAlert size={24} strokeWidth={1.8} />
						</div>
						<h1
							className="font-display mb-2 text-[22px] font-extrabold"
							style={{ color: "var(--text)" }}
						>
							Acesso negado
						</h1>
						<p
							className="mx-auto mb-6 max-w-[340px] text-[14px]"
							style={{ color: "var(--text-muted)" }}
						>
							Você não tem permissão para acessar esta área. Esta seção é
							restrita a administradores.
						</p>
						<Link
							href="/"
							className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white"
							style={{ background: "var(--accent)" }}
						>
							Voltar para o início
						</Link>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="flex-1" style={{ background: "var(--surface)" }}>
			<div className="container mx-auto px-6 py-8 sm:py-10">
				<div className="grid gap-6 lg:grid-cols-[236px_minmax(0,1fr)]">
					<aside
						className="h-fit rounded-xl p-3"
						style={{ background: "var(--hero-bg)" }}
					>
						<p
							className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
							style={{ color: "rgba(255,255,255,0.6)" }}
						>
							Administração
						</p>
						<nav className="grid gap-1">
							{adminNavItems.map(({ icon: Icon, label, href }) => {
								const active =
									href === "/admin" ? pathname === href : pathname.startsWith(href);

								return (
									<Link
										key={href}
										href={href}
										className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors"
										style={{
											background: active ? "var(--accent)" : "transparent",
											color: active
												? "var(--palette-white)"
												: "rgba(255,255,255,0.72)",
										}}
									>
										<Icon size={16} strokeWidth={1.8} />
										{label}
									</Link>
								);
							})}
						</nav>
					</aside>

					<div className="min-w-0">{children}</div>
				</div>
			</div>
		</main>
	);
}
