'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Car, PublicReview, Review } from '@/types';
import { ScoreBadge } from './ScoreBadge';
import { TagBadge } from './TagBadge';

type ReviewCardProps = {
  review: Review | PublicReview;
  car?: Car;
  compact?: boolean;
};

export function ReviewCard({ review, car, compact }: ReviewCardProps) {
  const reviewHref = 'slug' in review && review.slug
    ? `/reviews/${review.slug}`
    : `/reviews/${review.id}`;
  const vehicleTag = 'vehicle' in review && review.vehicle
    ? review.vehicle.brand
    : car?.segment ?? '';
  const yearTag = 'vehicle' in review && review.vehicle
    ? review.vehicle.year
    : car?.year ?? '';
  const commentsCount = 'commentsCount' in review && review.commentsCount !== undefined
    ? review.commentsCount
    : 'comments' in review
      ? review.comments
      : 0;

  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={reviewHref}
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
      <div className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <TagBadge label={vehicleTag} />
          <ScoreBadge score={review.score} size="sm" />
        </div>
        <div className="text-[11px] font-medium uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-light)' }}>
          {yearTag}
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
          <span>{commentsCount} comentários</span>
        </div>
      </div>
    </Link>
  );
}
