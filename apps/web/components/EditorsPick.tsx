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
			className="max-w-2xl rounded-2xl p-8 flex flex-col gap-4"
			style={{ background: "var(--hero-bg)" }}
		>
			{/* Linha superior: badge + score */}
			<div className="flex items-start justify-between gap-4">
				<span
					className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
					style={{ background: "var(--accent)", color: "var(--palette-white)" }}
				>
					★ Escolha do editor
				</span>

				{/* Score badge — grande, à direita */}
				<span className="inline-flex items-center gap-1 bg-white/10 rounded-full px-4 py-2 flex-shrink-0">
					<span className="text-yellow-400 text-xl">★</span>
					<span className="text-2xl font-extrabold" style={{ color: "var(--palette-white)" }}>
						{review.score}
					</span>
					<span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.6)" }}>
						/5
					</span>
				</span>
			</div>

			{/* Nome e ano */}
			<div>
				<h2
					className="font-display font-extrabold text-3xl sm:text-4xl leading-tight"
					style={{ color: "var(--palette-white)" }}
				>
					{carName}
				</h2>
				{year !== null && (
					<p className="text-base mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
						{year}
					</p>
				)}
			</div>

			{/* Headline */}
			<p className="text-lg font-bold" style={{ color: "var(--palette-white)" }}>
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
				className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:brightness-90"
				style={{ background: "var(--accent)", color: "var(--palette-white)" }}
			>
				Ler avaliação completa →
			</Link>
		</div>
	);
}
