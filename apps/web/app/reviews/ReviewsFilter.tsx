'use client';

import { useState } from 'react';
import type { Car, Review } from '@/types';
import { ReviewCard } from '@/components/ReviewCard';

type ReviewWithCar = { review: Review; car: Car };

type ReviewsFilterProps = {
  items: ReviewWithCar[];
  segments: string[];
};

export function ReviewsFilter({ items, segments }: ReviewsFilterProps) {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? items
    : items.filter(({ car }) => car.segment === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...segments].map(seg => (
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
