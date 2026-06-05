import Link from "next/link";
import type { PublicReview } from "@/types";

type EditorsPickProps = {
	review: PublicReview;
};

export function EditorsPick({ review }: EditorsPickProps) {
	const href =
		"slug" in review && review.slug
			? `/reviews/${review.slug}`
			: `/reviews/${review.id}`;

	const carName = review.vehicle
		? `${review.vehicle.brand} ${review.vehicle.model}`
		: review.title;

	const year = review.vehicle?.year ?? null;

	return (
		<div
			className="rounded-2xl p-8 flex flex-col md:flex-row gap-8 md:items-center"
			style={{ background: "var(--hero-bg)" }}
		>
			{/* Coluna esquerda — conteúdo */}
			<div className="flex-1 flex flex-col gap-4">
				{/* Badge */}
				<span
					className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
					style={{ background: "var(--accent)", color: "var(--palette-white)" }}
				>
					★ Escolha do editor
				</span>

				{/* Nome e ano */}
				<div>
					<h2
						className="font-display font-extrabold text-3xl sm:text-4xl leading-tight"
						style={{ color: "var(--palette-white)" }}
					>
						{carName}
					</h2>
					{year !== null && (
						<p
							className="text-base mt-1"
							style={{ color: "rgba(255,255,255,0.65)" }}
						>
							{year}
						</p>
					)}
				</div>

				{/* Score badge */}
				<span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-sm font-bold bg-white/10">
					<span className="text-yellow-400">★</span>
					<span style={{ color: "var(--palette-white)" }}>{review.score}</span>
					<span
						className="text-xs font-normal"
						style={{ color: "rgba(255,255,255,0.6)" }}
					>
						/5
					</span>
				</span>

				{/* Headline */}
				<p
					className="text-lg font-bold"
					style={{ color: "var(--palette-white)" }}
				>
					{review.title}
				</p>

				{/* Excerpt */}
				{review.excerpt && (
					<p
						className="text-sm leading-relaxed line-clamp-3"
						style={{ color: "rgba(255,255,255,0.75)" }}
					>
						{review.excerpt}
					</p>
				)}

				{/* CTA */}
				<Link
					href={href}
					className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
					style={{ background: "var(--accent)", color: "var(--palette-white)" }}
				>
					Ler avaliação completa →
				</Link>
			</div>

			{/* Coluna direita — placeholder de imagem */}
			<div className="w-full md:w-[42%] min-h-[180px] md:min-h-[280px] rounded-xl flex items-center justify-center bg-white/5">
				<span className="text-5xl">🚗</span>
			</div>
		</div>
	);
}
