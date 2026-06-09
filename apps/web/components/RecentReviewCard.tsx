"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PublicReview } from "@/types";

type RecentReviewCardProps = {
  review: PublicReview;
};

export function RecentReviewCard({ review }: RecentReviewCardProps) {
  const href =
    review.slug ? `/reviews/${review.slug}` : `/reviews/${review.id}`;

  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
    : review.title;

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block rounded-xl p-5 transition-all duration-200"
      style={{
        background: "var(--palette-white)",
        border: "1px solid var(--border)",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Linha superior: nome do veículo + score inline */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="font-bold text-sm leading-snug transition-colors duration-200"
          style={{ color: hovered ? "var(--accent)" : "var(--text)" }}
        >
          {carName}
        </span>
        <span className="inline-flex items-center gap-0.5 flex-shrink-0">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {review.score}
          </span>
          <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
            /5
          </span>
        </span>
      </div>

      {/* Excerpt */}
      {review.excerpt && (
        <p
          className="text-sm line-clamp-2 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          {review.excerpt}
        </p>
      )}

      {/* Rodapé: author · date · comments */}
      <div
        className="flex items-center gap-1.5 text-xs flex-wrap"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="text-gray-700">{review.author}</span>
        <span>·</span>
        <span>{review.date}</span>
        <span>·</span>
        <MessageSquare size={12} strokeWidth={1.8} />
        <span>{review.commentsCount ?? 0}</span>
      </div>
    </Link>
  );
}
