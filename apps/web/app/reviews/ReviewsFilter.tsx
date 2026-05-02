'use client';

import { useState } from 'react';
import type { Car, PublicReview, Review } from '@/types';
import { ReviewCard } from '@/components/ReviewCard';

type ReviewWithCar = {
  review: Review | PublicReview;
  car?: Car;
};

type ReviewsFilterProps = {
  items: ReviewWithCar[];
};

function getItemLabel(item: ReviewWithCar) {
  if (item.car) {
    return item.car.segment;
  }

  if ('vehicle' in item.review && item.review.vehicle) {
    return item.review.vehicle.brand;
  }

  return 'Sem categoria';
}

export function ReviewsFilter({ items }: ReviewsFilterProps) {
  const [active, setActive] = useState('Todos');
  const segments = [...new Set(items.map(getItemLabel))].filter(Boolean);

  const filtered = active === 'Todos'
    ? items
    : items.filter((item) => getItemLabel(item) === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {['Todos', ...segments].map(seg => (
          <button
            key={seg}
            onClick={() => setActive(seg)}
            className="px-3.5 py-1.5 rounded-lg border text-[13px] font-medium cursor-pointer transition-all duration-150"
            style={{
              background:  active === seg ? 'var(--accent-light)' : 'var(--surface-2)',
              borderColor: active === seg ? 'var(--accent)'       : 'var(--border)',
              color:       active === seg ? 'var(--accent)'       : 'var(--text-muted)',
            }}
          >
            {seg}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {filtered.map(({ review, car }) => (
          <ReviewCard key={review.id} review={review} car={car} />
        ))}
      </div>
    </>
  );
}
