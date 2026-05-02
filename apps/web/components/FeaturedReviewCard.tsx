'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Car, PublicReview, Review } from '@/types';
import { ScoreBadge } from './ScoreBadge';
import { TagBadge } from './TagBadge';

type FeaturedReviewCardProps = {
  review: Review | PublicReview;
  car?: Car;
};

export function FeaturedReviewCard({ review, car }: FeaturedReviewCardProps) {
  const reviewHref = 'slug' in review && review.slug
    ? `/reviews/${review.slug}`
    : `/reviews/${review.id}`;
  const brandTag = 'vehicle' in review && review.vehicle
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
      className="block w-full h-full rounded-2xl overflow-hidden border transition-all duration-200"
      style={{
        background:  'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow:   hovered ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
        transform:   hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-0">
        <div className="flex flex-wrap gap-1.5">
          <TagBadge label={brandTag} />
          <TagBadge label={`${yearTag}`} />
        </div>
        <ScoreBadge score={review.score} size="md" />
      </div>
      <div className="p-5 pb-6">
        <div className="mb-3">
          <span
            className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-[0.06em] uppercase text-white"
            style={{ background: 'var(--accent)' }}
          >
            Escolha do editor
          </span>
        </div>
        <div className="font-display font-extrabold text-xl leading-tight mb-2.5" style={{ color: 'var(--text)', textWrap: 'pretty' } as React.CSSProperties}>
          {review.title}
        </div>
        <p className="text-[14px] leading-relaxed mb-3.5" style={{ color: 'var(--text-muted)', textWrap: 'pretty' } as React.CSSProperties}>
          {review.excerpt ?? ''}
        </p>
        <div className="text-[13px] flex gap-2.5" style={{ color: 'var(--text-light)' }}>
          <span className="font-medium" style={{ color: 'var(--accent)' }}>{review.author}</span>
          <span>·</span>
          <span>{review.date}</span>
          <span>·</span>
          <span>{commentsCount} comentários</span>
        </div>
      </div>
    </Link>
  );
}
