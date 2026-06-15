import { Star } from "lucide-react";
import { notFound } from "next/navigation";
import { fetchReviewBySlug, fetchReviewComments } from "@/api/reviews";
import { MarkdownViewer } from "@/components/MarkdownViewer";
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
		<div className="flex items-center gap-1" style={{ color: "var(--accent)" }}>
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
	const vehicleName = review.vehicle
		? `${review.vehicle.brand} ${review.vehicle.model}`
		: review.title;

	return (
		<main className="flex-1" style={{ background: "var(--bg)" }}>
			<div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-8">
				<section
					className="flex flex-col gap-8 rounded-2xl p-8 md:flex-row"
					style={{ background: "var(--hero-bg)" }}
				>
					<div className="flex flex-1 flex-col gap-4">
						<span
							className="inline-flex self-start rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
							style={{
								background: "var(--accent)",
								color: "var(--palette-white)",
							}}
						>
							Avaliação
						</span>

						<div>
							<h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
								{vehicleName}
							</h1>
							{review.vehicle ? (
								<p className="mt-1 text-lg font-semibold text-blue-400">
									{review.vehicle.year}
								</p>
							) : null}
						</div>

						{review.title !== vehicleName ? (
							<p className="text-lg font-semibold text-white">{review.title}</p>
						) : null}

						<div
							className="flex flex-wrap items-center gap-2 text-sm"
							style={{ color: "rgba(255,255,255,0.7)" }}
						>
							<span className="font-semibold text-blue-400">
								{review.author}
							</span>
							<span>·</span>
							<span>{review.date}</span>
							<span>·</span>
							<span>{commentsCount} comentários</span>
						</div>

						{review.excerpt ? (
							<p
								className="max-w-2xl text-sm leading-relaxed"
								style={{ color: "rgba(255,255,255,0.75)" }}
							>
								{review.excerpt}
							</p>
						) : null}

						{review.kmDriven !== null ? (
							<div className="inline-flex self-start items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white">
								<span className="font-semibold">Quilometragem</span>
								<span style={{ color: "rgba(255,255,255,0.7)" }}>
									{formatMileage(review.kmDriven)}
								</span>
							</div>
						) : null}
					</div>

					<div className="flex flex-col items-center justify-center gap-2 text-center md:w-[40%]">
						<span
							className="font-extrabold leading-none text-white"
							style={{ fontSize: "7rem" }}
						>
							{review.score}
						</span>
						<span
							className="text-2xl font-normal"
							style={{ color: "rgba(255,255,255,0.5)" }}
						>
							/5
						</span>
						<div className="my-1 w-10 border-t border-white/20" />
						<p className="text-lg font-bold text-white">Nota da avaliação</p>
						<p className="text-sm text-blue-400">{commentsCount} comentários</p>
					</div>
				</section>

				<section
					className="rounded-2xl border px-5 py-6"
					style={{
						background: "var(--surface)",
						borderColor: "var(--border)",
					}}
				>
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
							style={{ color: "var(--text-muted)" }}
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
										background: "var(--palette-white)",
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
											style={{ color: "var(--text-muted)" }}
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
									background: "var(--palette-white)",
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
	);
}
