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
          Fórum da comunidade
        </h1>
        <p
          className="text-base sm:text-lg"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Descubra opiniões reais de quem realmente dirigiu
        </p>

        <div className="w-full flex flex-col sm:flex-row gap-3 mt-5">
          <input
            aria-label="Buscar avaliações"
            type="text"
            placeholder="Buscar por marca, modelo ou categoria..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E84E27] focus:border-transparent"
          />
          <Link
            href="/reviews/new"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#E84E27] hover:bg-[#d44522] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            + Nova avaliação
          </Link>
        </div>
      </div>
    </section>
  );
}
