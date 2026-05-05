import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Nav } from "@/components/Nav";
import { ScoreBadge } from "@/components/ScoreBadge";
import { TagBadge } from "@/components/TagBadge";
import { fetchReviewBySlug, fetchReviewComments } from "@/lib/reviews";
import { ReviewCommentForm } from "./review-comment-form";

type ReviewPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const ratingLabels: Record<string, string> = {
  CONSUMPTION: "Consumo",
  MAINTENANCE: "Manutenção",
  RELIABILITY: "Confiabilidade",
  COMFORT: "Conforto",
  PERFORMANCE: "Performance",
  TECHNOLOGY: "Tecnologia",
  FINISH: "Acabamento",
  RESALE_VALUE: "Valor de revenda",
};

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < value;

        return (
          <Star
            key={index}
            size={14}
            strokeWidth={2}
            fill={filled ? "currentColor" : "none"}
            className={filled ? "" : "opacity-30"}
          />
        );
      })}
    </div>
  );
}

function formatMileage(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = await fetchReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  const comments = await fetchReviewComments(review.id);
  const commentsCount = comments.length;

  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[960px] mx-auto px-6 py-10 flex flex-col gap-8">
          <section
            className="rounded-2xl border px-5 py-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div className="flex flex-wrap gap-1.5">
                {review.vehicle ? (
                  <>
                    <TagBadge label={review.vehicle.brand} />
                    <TagBadge label={review.vehicle.model} />
                    <TagBadge label={`${review.vehicle.year}`} />
                  </>
                ) : (
                  <TagBadge label="Avaliação" />
                )}
              </div>
              <ScoreBadge score={review.score} size="lg" />
            </div>

            <h1
              className="font-display font-extrabold text-3xl leading-tight mb-3"
              style={{ color: "var(--text)" }}
            >
              {review.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-2 text-[13px] mb-6"
              style={{ color: "var(--text-light)" }}
            >
              <span className="font-medium" style={{ color: "var(--accent)" }}>
                {review.author}
              </span>
              <span>·</span>
              <span>{review.date}</span>
              <span>·</span>
              <span>{commentsCount} comentários</span>
            </div>

            {review.kmDriven !== null ? (
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] mb-6"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--border)",
                  color: "var(--text-light)",
                }}
              >
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  Quilometragem
                </span>
                <span>{formatMileage(review.kmDriven)}</span>
              </div>
            ) : null}

            <div className="space-y-6">
              <MarkdownViewer value={review.content} />

              {review.pros || review.cons ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {review.pros ? (
                    <div
                      className="rounded-xl border px-4 py-4"
                      style={{
                        background: "var(--bg)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <h2
                        className="font-display font-bold text-[15px] mb-2"
                        style={{ color: "var(--text)" }}
                      >
                        Prós
                      </h2>
                      <p
                        className="text-[14px] leading-6"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {review.pros}
                      </p>
                    </div>
                  ) : null}
                  {review.cons ? (
                    <div
                      className="rounded-xl border px-4 py-4"
                      style={{
                        background: "var(--bg)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <h2
                        className="font-display font-bold text-[15px] mb-2"
                        style={{ color: "var(--text)" }}
                      >
                        Contras
                      </h2>
                      <p
                        className="text-[14px] leading-6"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {review.cons}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          {review.ratings.length > 0 ? (
            <section
              className="rounded-2xl border px-5 py-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="font-display font-bold text-xl mb-4"
                style={{ color: "var(--text)" }}
              >
                Avaliações por categoria
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {review.ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="rounded-xl border px-4 py-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="text-[14px] font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {ratingLabels[rating.category] ?? rating.category}
                      </span>
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: "var(--accent)" }}
                      >
                        {rating.value}/5
                      </span>
                    </div>
                    <div className="mt-3">
                      <RatingStars value={rating.value} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "var(--text)" }}
              >
                Comentários
              </h2>
              <span
                className="text-[13px]"
                style={{ color: "var(--text-light)" }}
              >
                {comments.length} comentários
              </span>
            </div>

            <ReviewCommentForm reviewId={review.id} />

            <div className="space-y-3">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl border px-4 py-4"
                    style={{
                      background: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span
                        className="font-medium text-[14px]"
                        style={{ color: "var(--accent)" }}
                      >
                        {comment.author}
                      </span>
                      <span
                        className="text-[12px]"
                        style={{ color: "var(--text-light)" }}
                      >
                        {comment.date}
                      </span>
                    </div>
                    <MarkdownViewer value={comment.content} />
                  </div>
                ))
              ) : (
                <div
                  className="rounded-xl border px-4 py-4"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p
                    className="text-[14px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Ainda não há comentários nessa avaliação.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
