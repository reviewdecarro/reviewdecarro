import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ReviewsFilter } from "./ReviewsFilter";
import { ReviewCreateButton } from "./review-create-button";
import { fetchPublicReviews } from "@/lib/reviews";

export default async function ReviewsPage() {
  const reviews = await fetchPublicReviews();
  const items = reviews.map((review) => ({ review }));

  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1
                  className="font-display font-extrabold text-3xl mb-1"
                  style={{ color: "var(--text)" }}
                >
                  Avaliações
                </h1>
                <p
                  className="text-[14px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {reviews.length} avaliações especializadas
                </p>
              </div>

              <ReviewCreateButton />
            </div>
          </div>

          {reviews.length > 0 ? (
            <ReviewsFilter items={items} />
          ) : (
            <div
              className="rounded-xl border px-5 py-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                Ainda não há avaliações publicadas.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
