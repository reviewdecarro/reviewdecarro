import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { fetchPublicReviews } from "@/lib/reviews";
import { ReviewCreateButton } from "./review-create-button";
import { ReviewsFilter } from "./ReviewsFilter";

export default async function ReviewsPage() {
  const reviews = await fetchPublicReviews();
  const items = reviews.map((review) => ({ review }));

  return (
    <>
      <Nav />
      <main className="flex-1" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1
              className="font-display font-extrabold text-3xl"
              style={{ color: "var(--text)" }}
            >
              {reviews.length} avaliações encontradas
            </h1>
            <ReviewCreateButton />
          </div>

          {items.length > 0 ? (
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
