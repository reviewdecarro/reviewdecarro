import { MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import type { Car, PublicReview, Review } from "@/types";

type ReviewPageCardProps = {
  review: Review | PublicReview;
  car?: Car;
};

export function ReviewPageCard({ review, car }: ReviewPageCardProps) {
  const href =
    "slug" in review && review.slug
      ? `/reviews/${review.slug}`
      : `/reviews/${review.id}`;

  const segment =
    "vehicle" in review && review.vehicle
      ? review.vehicle.brand
      : (car?.segment ?? "");

  const carName =
    "vehicle" in review && review.vehicle
      ? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
      : car
        ? `${car.brand} ${car.model} ${car.year}`
        : review.title;

  const commentsCount =
    "commentsCount" in review
      ? review.commentsCount
      : "comments" in review
        ? review.comments
        : 0;

  const likesCount = "votes" in review ? (review as Review).votes : null;

  return (
    <Link
      href={href}
      className="group block bg-white rounded-xl p-5 border border-[var(--border)] transition-all duration-200 hover:shadow-md"
    >
      {/* Top: segment badge + score */}
      <div className="flex items-center justify-between mb-3">
        {segment ? (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]">
            {segment}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-0.5">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-bold text-[var(--text)]">
            {review.score}
          </span>
          <span className="text-xs text-[var(--text-muted)]">/5</span>
        </span>
      </div>

      {/* Car name */}
      <h3 className="font-extrabold text-lg leading-tight mb-1 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
        {carName}
      </h3>

      {/* Excerpt */}
      {"excerpt" in review && review.excerpt && (
        <p className="text-sm line-clamp-2 mb-4 text-[var(--text-muted)]">
          {review.excerpt}
        </p>
      )}

      {/* Footer */}
      <div className="border-t border-[var(--border)] mt-3 pt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gray-700">
          {review.author}
        </span>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          {likesCount !== null && (
            <>
              <ThumbsUp size={13} strokeWidth={1.8} />
              <span>{likesCount}</span>
            </>
          )}
          <MessageSquare size={13} strokeWidth={1.8} />
          <span>{commentsCount}</span>
          <span>·</span>
          <span>{review.date}</span>
        </div>
      </div>
    </Link>
  );
}
