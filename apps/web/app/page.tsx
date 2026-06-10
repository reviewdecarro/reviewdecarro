import { MessageSquare } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { DiscussionCard } from "@/components/DiscussionCard";
import { EditorsPick } from "@/components/EditorsPick";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { RecentReviewCard } from "@/components/RecentReviewCard";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchForumTopics } from "@/lib/forum";
import { fetchPublicReviews } from "@/lib/reviews";

export default async function HomePage() {
	const reviews = await fetchPublicReviews();
	const threads = await fetchForumTopics();
	const featuredThreads = [...threads].sort((a, b) => {
		if (b.upvotes !== a.upvotes) {
			return b.upvotes - a.upvotes;
		}

		if (b.comments !== a.comments) {
			return b.comments - a.comments;
		}

		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
	const featuredReview = [...reviews].sort((a, b) => {
		if (b.score !== a.score) {
			return b.score - a.score;
		}

		return (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
	})[0];
	const latestReviews = reviews
		.filter((review) => review.id !== featuredReview?.id)
		.slice(0, 4);
	const topDiscussions = featuredThreads.slice(0, 3);

	return (
		<>
			<Nav />
			<main className="flex-1" style={{ background: "var(--bg)" }}>
				<div className="container mx-auto px-6 py-12 md:py-16 flex flex-col gap-14">
					{featuredReview && (
						<section>
							<EditorsPick review={featuredReview} />
						</section>
					)}

					<section>
						<SectionHeader
							title="Avaliações Recentes"
							action="Ver todas →"
							href="/reviews"
							icon={
								<span className="text-yellow-400 text-2xl leading-none">★</span>
							}
						/>
						{latestReviews.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{latestReviews.map((review) => (
									<RecentReviewCard key={review.id} review={review} />
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
				</div>

				<div className="w-full bg-gray-50 py-12">
					<div className="container mx-auto px-6">
						<section>
							<SectionHeader
								title="Discussões em Alta"
								action="Ver todas →"
								href="/forum"
								icon={
									<MessageSquare size={24} style={{ color: "var(--accent)" }} />
								}
							/>
							{topDiscussions.length > 0 ? (
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									{topDiscussions.map((thread) => (
										<DiscussionCard key={thread.id} thread={thread} />
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
										Ainda não há discussões em alta.
									</p>
								</div>
							)}
						</section>
					</div>
				</div>
			<CtaSection />
			</main>
			<Footer />
		</>
	);
}
