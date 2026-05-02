import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
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

						<div className="space-y-6">
							<p
								className="text-[16px] leading-7"
								style={{ color: "var(--text-muted)" }}
							>
								{review.content}
							</p>

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

					<section className="space-y-4">
						<div className="flex items-center justify-between gap-4">
							<h2
								className="font-display font-bold text-xl"
								style={{ color: "var(--text)" }}
							>
								Comentários
							</h2>
							<span className="text-[13px]" style={{ color: "var(--text-light)" }}>
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
										<p
											className="text-[14px] leading-6"
											style={{ color: "var(--text-muted)" }}
										>
											{comment.content}
										</p>
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
									<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
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
