import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { PublicReview } from "@/types";

type EditorsPickProps = {
	review: PublicReview;
	pros?: string[];
};

export function EditorsPick({ review, pros }: EditorsPickProps) {
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
			className="rounded-2xl p-8 flex flex-col md:flex-row gap-8"
			style={{ background: "var(--hero-bg)" }}
		>
			{/* Coluna esquerda */}
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
						className="font-display font-extrabold text-5xl sm:text-6xl leading-tight text-white"
					>
						{carName}
					</h2>
					{year !== null && (
						<p className="text-blue-400 font-semibold text-lg mt-1">{year}</p>
					)}
				</div>

				{/* Score badge + contagem */}
				<div className="flex items-center gap-3">
					<span className="inline-flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5">
						<span className="text-yellow-400 font-bold text-base">{review.score}</span>
						<span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.6)" }}>/5</span>
					</span>
					<span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
						{review.commentsCount} avaliações
					</span>
				</div>

				{/* Excerpt */}
				{review.excerpt && (
					<p
						className="text-sm leading-relaxed line-clamp-3"
						style={{ color: "rgba(255,255,255,0.75)" }}
					>
						{review.excerpt}
					</p>
				)}

				{/* Pontos positivos — opcional */}
				{pros && pros.length > 0 && (
					<div>
						<p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
							Pontos positivos
						</p>
						<ul className="flex flex-col gap-1.5">
							{pros.slice(0, 3).map((pro, i) => (
								<li key={i} className="flex items-center gap-2 text-sm text-white font-semibold">
									<CheckCircle size={16} className="text-green-400 flex-shrink-0" />
									{pro}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* CTA */}
				<Link
					href={href}
					className="mt-2 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:brightness-90 transition-all"
					style={{ background: "var(--accent)" }}
				>
					Ler avaliação completa →
				</Link>
			</div>

			{/* Coluna direita — score grande */}
			<div className="flex flex-col items-center justify-center text-center md:w-[40%] gap-2">
				<span className="font-extrabold leading-none text-white" style={{ fontSize: "7rem" }}>
					{review.score}
				</span>
				<span className="text-2xl font-normal" style={{ color: "rgba(255,255,255,0.5)" }}>/5</span>
				<div className="w-10 border-t border-white/20 my-1" />
				<p className="text-white font-bold text-lg">Avaliação da Comunidade</p>
				<p className="text-blue-400 text-sm">{review.commentsCount} avaliações</p>
			</div>
		</div>
	);
}
