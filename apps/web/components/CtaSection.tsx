import { SquarePen, Star } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 — Compartilhe sua avaliação */}
        <div
          className="rounded-2xl p-8 flex flex-col gap-5"
          style={{ background: "var(--accent)" }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20">
            <Star size={24} className="text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl text-white">
              Compartilhe sua avaliação
            </h3>
            <p className="text-sm text-white/80">
              Já teve experiência com algum veículo? Ajude outros entusiastas
              compartilhando sua opinião sincera.
            </p>
          </div>
          <Link
            href="/reviews/new"
            className="w-full text-center py-3 rounded-lg bg-white font-semibold hover:brightness-95 transition-all text-sm"
            style={{ color: "var(--accent)" }}
          >
            Criar avaliação
          </Link>
        </div>

        {/* Card 2 — Participe do fórum */}
        <div
          className="rounded-2xl p-8 flex flex-col gap-5 bg-white border"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-tint)" }}
          >
            <SquarePen size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl" style={{ color: "var(--text)" }}>
              Participe do fórum
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Tire dúvidas, compartilhe dicas e conecte-se com outros
              apaixonados por carros.
            </p>
          </div>
          <Link
            href="/forum/new"
            className="w-full text-center py-3 rounded-lg font-semibold text-white hover:brightness-90 transition-all text-sm"
            style={{ background: "var(--accent)" }}
          >
            Criar tópico
          </Link>
        </div>
      </div>
    </div>
  );
}
