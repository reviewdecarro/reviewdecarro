import { MessageSquare } from "lucide-react";
import Link from "next/link";
import type { PublicReview } from "@/types";

type RecentReviewCardProps = {
	review: PublicReview;
};

export function RecentReviewCard({ review }: RecentReviewCardProps) {
	const href = review.slug
		? `/reviews/${review.slug}`
		: `/reviews/${review.id}`;

	const carName = review.vehicle
		? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
		: review.title;

	return (
		<Link
			href={href}
			className="group block rounded-xl p-5 bg-white border border-[var(--border)] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
		>
			{/* Linha superior: nome do veículo + score inline */}
			<div className="flex items-start justify-between gap-2 mb-2">
				<span className="font-bold text-sm leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
					{carName}
				</span>
				<span className="inline-flex items-center gap-0.5 flex-shrink-0">
					<span className="text-yellow-400 text-sm">★</span>
					<span className="text-sm font-bold text-[var(--text)]">
						{review.score}
					</span>
					<span className="text-xs font-normal text-[var(--text-muted)]">
						/5
					</span>
				</span>
			</div>

			{/* Excerpt */}
			{review.excerpt && (
				<p className="text-sm line-clamp-2 mb-3 text-[var(--text-muted)]">
					{review.excerpt}
				</p>
			)}

			{/* Rodapé: author · date · comments */}
			<div className="flex items-center gap-1.5 text-xs flex-wrap text-[var(--text-muted)]">
				<span className="text-gray-700 font-semibold">{review.author}</span>
				<span>·</span>
				<span>{review.date}</span>
				<span>·</span>
				<MessageSquare size={12} strokeWidth={1.8} />
				<span>{review.commentsCount ?? 0}</span>
			</div>
		</Link>
	);
}
