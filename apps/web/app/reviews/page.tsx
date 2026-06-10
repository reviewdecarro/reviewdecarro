import { Footer } from "@/components/Footer";
import { fetchPublicReviews } from "@/lib/reviews";
import { FeaturedReviewBanner } from "./FeaturedReviewBanner";
import { ReviewsFilter } from "./ReviewsFilter";
import { ReviewCreateButton } from "./review-create-button";

export default async function ReviewsPage() {
	const reviews = await fetchPublicReviews();
	const featured = [...reviews].sort((a, b) => b.score - a.score)[0];
	const rest = reviews.filter((r) => r.id !== featured?.id);
	const items = rest.map((review) => ({ review }));

	return (
		<>
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

					{featured && (
						<div className="mb-8">
							<FeaturedReviewBanner review={featured} />
						</div>
					)}

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
