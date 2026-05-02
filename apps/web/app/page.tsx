import { Footer } from "@/components/Footer";
import { FeaturedReviewCard } from "@/components/FeaturedReviewCard";
import { ForumThreadRow } from "@/components/ForumThreadRow";
import { Nav } from "@/components/Nav";
import { ReviewCard } from "@/components/ReviewCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchPublicReviews } from "@/lib/reviews";
import { threads } from "@/lib/data";

export default async function HomePage() {
	const reviews = await fetchPublicReviews();
	const featuredReview =
		[...reviews].sort((a, b) => {
			if (b.score !== a.score) {
				return b.score - a.score;
			}

			return (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
		})[0];
	const latestReviews = reviews
		.filter((review) => review.id !== featuredReview?.id)
		.slice(0, 4);

	return (
		<>
			<Nav />
			<main className="flex-1" style={{ background: "var(--bg)" }}>
				<div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-14">
					<section>
						<SectionHeader title="Escolha do editor" />
						{featuredReview ? (
							<FeaturedReviewCard review={featuredReview} />
						) : (
							<div
								className="rounded-2xl border px-5 py-6"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									Ainda não há avaliações publicadas.
								</p>
							</div>
						)}
					</section>

					<section>
						<SectionHeader title="Avaliações recentes" action="Ver todas" />
						{latestReviews.length > 0 ? (
							<div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
								{latestReviews.map((review) => (
									<ReviewCard key={review.id} review={review} />
								))}
							</div>
						) : (
							<div
								className="rounded-xl border px-5 py-6"
								style={{
									background: "var(--surface)",
									borderColor: "var(--border)",
								}}
							>
								<p
									className="text-[14px]"
									style={{ color: "var(--text-muted)" }}
								>
									Ainda não há avaliações recentes.
								</p>
							</div>
						)}
					</section>

					<section>
						<SectionHeader title="Destaques do fórum" action="Ir para o fórum" />
						<div className="flex flex-col">
							{threads.map((thread) => (
								<ForumThreadRow key={thread.id} thread={thread} />
							))}
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</>
	);
}
