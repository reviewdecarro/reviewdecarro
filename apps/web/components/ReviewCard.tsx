import Link from "next/link";
import type { Car, PublicReview, Review } from "@/types";
import { ScoreBadge } from "./ScoreBadge";
import { TagBadge } from "./TagBadge";

type ReviewCardProps = {
	review: Review | PublicReview;
	car?: Car;
	compact?: boolean;
};

export function ReviewCard({ review, car, compact }: ReviewCardProps) {
	const reviewHref =
		"slug" in review && review.slug
			? `/reviews/${review.slug}`
			: `/reviews/${review.id}`;
	const vehicleTag =
		"vehicle" in review && review.vehicle
			? review.vehicle.brand
			: (car?.segment ?? "");
	const yearTag =
		"vehicle" in review && review.vehicle
			? review.vehicle.year
			: (car?.year ?? "");
	const commentsCount =
		"commentsCount" in review && review.commentsCount !== undefined
			? review.commentsCount
			: "comments" in review
				? review.comments
				: 0;

	return (
		<Link
			href={reviewHref}
			className="block w-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 hover:shadow-lg"
		>
			<div className={compact ? "p-3" : "p-4"}>
				<div className="flex items-start justify-between gap-2 mb-2">
					<TagBadge label={vehicleTag} />
					<ScoreBadge score={review.score} size="sm" />
				</div>
				<div className="text-[11px] font-medium uppercase tracking-[0.06em] mb-2 text-[var(--text-muted)]">
					{yearTag}
				</div>
				<div
					className={`font-display font-bold leading-snug mb-2 text-[var(--text)] [text-wrap:pretty] ${compact ? "text-[13px]" : "text-[15px]"}`}
				>
					{review.title}
				</div>
				<div className="text-[12px] flex flex-wrap gap-2 text-[var(--text-muted)]">
					<span>{review.author}</span>
					<span>·</span>
					<span>{review.date}</span>
					<span>·</span>
					<span>{commentsCount} comentários</span>
				</div>
			</div>
		</Link>
	);
}
