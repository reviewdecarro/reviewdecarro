"use client";

import type { Car, PublicReview, Review } from "@/types";
import { ReviewPageCard } from "./ReviewPageCard";
import { ReviewsFilterPanel } from "./ReviewsFilterPanel";

type ReviewWithCar = {
  review: Review | PublicReview;
  car?: Car;
};

type ReviewsFilterProps = {
  items: ReviewWithCar[];
};

export function ReviewsFilter({ items }: ReviewsFilterProps) {
  return (
    <div className="flex gap-8 items-start">
      {/* Sidebar de filtros — visível apenas em desktop */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <ReviewsFilterPanel />
      </aside>

      {/* Grid de cards */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-4" style={{ color: "var(--text-muted)" }}>
          {items.length} {items.length === 1 ? "avaliação encontrada" : "avaliações encontradas"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map(({ review, car }) => (
            <ReviewPageCard key={review.id} review={review} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
