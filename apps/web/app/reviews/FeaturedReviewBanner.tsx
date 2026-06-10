import { MessageSquare } from "lucide-react";
import Link from "next/link";
import type { PublicReview } from "@/types";

type FeaturedReviewBannerProps = {
  review: PublicReview;
};

export function FeaturedReviewBanner({ review }: FeaturedReviewBannerProps) {
  const href = review.slug
    ? `/reviews/${review.slug}`
    : `/reviews/${review.id}`;

  const carName = review.vehicle
    ? `${review.vehicle.brand} ${review.vehicle.model} ${review.vehicle.year}`
    : review.title;

  return (
    <div
      className="rounded-2xl p-8 flex flex-col gap-4"
      style={{ background: "var(--accent)" }}
    >
      {/* Linha superior: badge + score */}
      <div className="flex items-start justify-between gap-4">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style={{ background: "rgba(0,0,0,0.15)" }}
        >
          ★ Avaliação em destaque
        </span>
        <span className="inline-flex items-center gap-1 bg-white rounded-full px-3 py-1.5 text-sm font-bold flex-shrink-0">
          <span className="text-yellow-400">★</span>
          <span style={{ color: "var(--text)" }}>{review.score}</span>
          <span
            className="text-xs font-normal"
            style={{ color: "var(--text-muted)" }}
          >
            /5
          </span>
        </span>
      </div>

      {/* Nome do veículo + segmento */}
      <div>
        <h2 className="font-extrabold text-2xl sm:text-3xl leading-tight text-white">
          {carName}
        </h2>
        {review.vehicle && (
          <p
            className="text-sm uppercase tracking-wide mt-1"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {review.vehicle.brand}
          </p>
        )}
      </div>

      {/* Título da review */}
      <p className="font-bold text-lg text-white">{review.title}</p>

      {/* Excerpt */}
      {review.excerpt && (
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {review.excerpt}
        </p>
      )}

      {/* Metadados */}
      <div
        className="flex items-center gap-2 flex-wrap text-sm"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        <MessageSquare size={14} strokeWidth={1.8} />
        <span>{review.commentsCount} comentários</span>
        <span>·</span>
        <span>
          {review.author} · {review.date}
        </span>
      </div>

      {/* CTA */}
      <Link
        href={href}
        className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white font-semibold hover:brightness-95 transition-all text-sm"
        style={{ color: "var(--accent)" }}
      >
        Ler avaliação completa →
      </Link>
    </div>
  );
}
