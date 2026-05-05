"use client";

import Link from "next/link";
import { useAuthSession } from "@/hooks/use-auth-session";

export function Footer() {
  const { isLoggedIn } = useAuthSession();

  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div
            className="font-display font-extrabold text-[18px]"
            style={{ color: "var(--text)" }}
          >
            PapoAuto
          </div>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Avaliações de carros, discussões no fórum e destaques da comunidade.
          </p>
        </div>
        <div
          className="flex items-center gap-4 text-[13px]"
          style={{ color: "var(--text-muted)" }}
        >
          <Link href="/" className="hover:opacity-80">
            Início
          </Link>
          <Link href="/reviews" className="hover:opacity-80">
            Avaliações
          </Link>
          {!isLoggedIn && (
            <Link href="/login" className="hover:opacity-80">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
