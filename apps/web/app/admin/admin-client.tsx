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
import { useAuthSession } from "@/hooks/use-auth-session";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Visão geral", href: "/admin", active: true },
  { icon: Users, label: "Usuários", href: "/admin/users", active: false },
  { icon: FileText, label: "Avaliações", href: "/admin/reviews", active: false },
  { icon: MessageSquare, label: "Fórum", href: "/admin/forum", active: false },
];

export function AdminClient() {
  const { authUser, isAdmin, isCheckingSession } = useAuthSession();

  if (isCheckingSession) {
    return (
      <div
        className="rounded-2xl border p-6 text-[14px]"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <LoaderCircle size={16} className="mr-2 inline animate-spin" />
        Validando permissões...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "oklch(0.97 0.04 25)", color: "oklch(0.45 0.17 25)" }}
        >
          <ShieldAlert size={24} strokeWidth={1.8} />
        </div>
        <h1
          className="font-display font-extrabold text-[22px] mb-2"
          style={{ color: "var(--text)" }}
        >
          Acesso negado
        </h1>
        <p
          className="text-[14px] mb-6 max-w-[340px] mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          Você não tem permissão para acessar esta área. Esta seção é restrita a administradores.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside
        className="rounded-2xl border p-3 h-fit"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p
          className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "var(--text-muted)" }}
        >
          Administração
        </p>
        <nav className="grid gap-1">
          {adminNavItems.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors"
              style={{
                background: active ? "var(--accent-tint)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="grid gap-4">
        <div>
          <h1
            className="font-display font-extrabold text-[28px] leading-tight"
            style={{ color: "var(--text)" }}
          >
            Painel de administração
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
            Bem-vindo, {authUser!.username}. Esta é a área administrativa do PapoAuto.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Usuários", value: "—", description: "Total de usuários cadastrados" },
            { label: "Avaliações", value: "—", description: "Avaliações publicadas" },
            { label: "Tópicos do fórum", value: "—", description: "Tópicos criados" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border px-5 py-4"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </p>
              <p
                className="mt-1 text-[28px] font-display font-extrabold"
                style={{ color: "var(--text)" }}
              >
                {stat.value}
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl border px-5 py-5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
            As funcionalidades de gestão serão adicionadas em versões futuras.
          </p>
        </div>
      </div>
    </div>
  );
}
