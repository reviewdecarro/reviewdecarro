import Link from "next/link";

export function HeroCommunity() {
  return (
    <section
      className="w-full py-16 px-6"
      style={{ background: "var(--hero-bg)" }}
    >
      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center gap-3">
        <h1
          className="font-display font-extrabold text-4xl sm:text-5xl leading-tight"
          style={{ color: "var(--palette-white)" }}
        >
          Avaliações da Comunidade
        </h1>
        <p
          className="text-base sm:text-lg"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Descubra opiniões reais de quem realmente dirigiu
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-3 mt-5">
          <input
            type="text"
            placeholder="Buscar por marca, modelo ou categoria..."
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none border"
            style={{
              background: "var(--hero-input-bg)",
              borderColor: "rgba(255,255,255,0.12)",
              color: "var(--palette-white)",
            }}
          />
          <Link
            href="/reviews/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
            style={{
              background: "var(--accent)",
              color: "var(--palette-white)",
            }}
          >
            + Nova avaliação
          </Link>
        </div>
      </div>
    </section>
  );
}
