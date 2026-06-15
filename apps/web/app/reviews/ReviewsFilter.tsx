"use client";

import type { Car, PublicReview, Review } from "@/types";
import { ReviewPageCard } from "./ReviewPageCard";

type ReviewWithCar = {
  review: Review | PublicReview;
  car?: Car;
};

type ReviewsFilterProps = {
  items: ReviewWithCar[];
};

export function ReviewsFilter({ items }: ReviewsFilterProps) {
  return (
    <div className="min-w-0">
      <p className="mb-4 text-sm font-medium text-text-muted">
        {items.length}{" "}
        {items.length === 1 ? "avaliação encontrada" : "avaliações encontradas"}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map(({ review, car }) => (
          <ReviewPageCard key={review.id} review={review} car={car} />
        ))}
      </div>
    </div>
  );
}
