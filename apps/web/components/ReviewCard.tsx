'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Car, Review } from '@/types';
import { CarPlaceholder } from './CarPlaceholder';
import { ScoreBadge } from './ScoreBadge';
import { TagBadge } from './TagBadge';

type ReviewCardProps = {
  review: Review;
  car: Car;
  compact?: boolean;
};

export function ReviewCard({ review, car, compact }: ReviewCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/reviews/${review.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block w-full rounded-xl overflow-hidden border transition-all duration-200"
      style={{
        background:  'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow:   hovered ? '0 6px 24px rgba(0,0,0,0.10)' : 'none',
        transform:   hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <CarPlaceholder
        brand={car.brand}
        model={car.model}
        segment={car.segment}
        className={`w-full ${compact ? 'h-[110px]' : 'h-[150px]'}`}
      />
      <div className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <TagBadge label={car.segment} />
          <ScoreBadge score={review.score} size="sm" />
        </div>
        <div
          className="font-display font-bold leading-snug mb-2"
          style={{ fontSize: compact ? 13 : 15, color: 'var(--text)', textWrap: 'pretty' } as React.CSSProperties}
        >
          {review.title}
        </div>
        <div className="text-[12px] flex flex-wrap gap-2" style={{ color: 'var(--text-light)' }}>
          <span>{review.author}</span>
          <span>·</span>
          <span>{review.date}</span>
          <span>·</span>
          <span>{review.comments} comments</span>
        </div>
      </div>
    </Link>
  );
}
