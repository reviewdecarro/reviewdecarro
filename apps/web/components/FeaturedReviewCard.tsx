'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Car, Review } from '@/types';
import { CarPlaceholder } from './CarPlaceholder';
import { ScoreBadge } from './ScoreBadge';
import { TagBadge } from './TagBadge';

type FeaturedReviewCardProps = {
  review: Review;
  car: Car;
};

export function FeaturedReviewCard({ review, car }: FeaturedReviewCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/reviews/${review.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block w-full h-full rounded-2xl overflow-hidden border transition-all duration-200"
      style={{
        background:  'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow:   hovered ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
        transform:   hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div className="relative">
        <CarPlaceholder brand={car.brand} model={car.model} segment={car.segment} className="w-full h-[240px]" />
        <div className="absolute top-3.5 left-3.5">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-[0.06em] uppercase text-white"
            style={{ background: 'var(--accent)' }}
          >
            Editor&apos;s Pick
          </span>
        </div>
        <div className="absolute top-3.5 right-3.5">
          <ScoreBadge score={review.score} size="md" />
        </div>
      </div>
      <div className="p-5 pb-6">
        <div className="flex gap-1.5 mb-3">
          <TagBadge label={car.segment} />
          <TagBadge label={`${car.year}`} />
        </div>
        <div className="font-display font-extrabold text-xl leading-tight mb-2.5" style={{ color: 'var(--text)', textWrap: 'pretty' } as React.CSSProperties}>
          {review.title}
        </div>
        <p className="text-[14px] leading-relaxed mb-3.5" style={{ color: 'var(--text-muted)', textWrap: 'pretty' } as React.CSSProperties}>
          {review.excerpt}
        </p>
        <div className="text-[13px] flex gap-2.5" style={{ color: 'var(--text-light)' }}>
          <span className="font-medium" style={{ color: 'var(--accent)' }}>{review.author}</span>
          <span>·</span>
          <span>{review.date}</span>
          <span>·</span>
          <span>{review.comments} comments</span>
        </div>
      </div>
    </Link>
  );
}
