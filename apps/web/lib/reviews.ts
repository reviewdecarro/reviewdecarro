import { API_BASE_URL } from "@/lib/api";
import type { PublicReview, ReviewComment } from "@/types";

type ApiReview = {
	id: string;
	slug: string;
	title: string;
	content: string;
	score: number;
	commentsCount: number;
	createdAt: string;
	pros?: string | null;
	cons?: string | null;
	user?: {
		id: string;
		username: string;
	};
	carVersionYear?: {
		id: string;
		year: number;
		carVersion?: {
			id: string;
			versionName: string;
			slug: string;
			model?: {
				id: string;
				name: string;
				slug: string;
				brand?: {
					id: string;
					name: string;
					slug: string;
				};
			};
		};
	};
};

type ReviewsResponse = {
	reviews?: ApiReview[];
};

type ReviewResponse = {
	review?: ApiReview;
};

type CommentResponse = {
	comments?: Array<{
		id: string;
		reviewId: string;
		userId: string;
		content: string;
		createdAt: string;
		user?: {
			id: string;
			username: string;
		};
	}>;
};

function truncate(value: string, maxLength: number) {
	if (value.length <= maxLength) {
		return value;
	}

	return `${value.slice(0, maxLength).trimEnd()}...`;
}

function formatRelativeDate(dateValue: string) {
	const date = new Date(dateValue);

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const diffMs = Date.now() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

	if (diffDays <= 0) {
		if (diffHours <= 0) {
			return "há instantes";
		}

		return `há ${diffHours}h`;
	}

	if (diffDays === 1) {
		return "há 1 dia";
	}

	if (diffDays < 30) {
		return `há ${diffDays} dias`;
	}

	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
}

function toPublicReview(review: ApiReview): PublicReview {
	const brand = review.carVersionYear?.carVersion?.model?.brand?.name;
	const model = review.carVersionYear?.carVersion?.model?.name;
	const year = review.carVersionYear?.year;

	return {
		id: review.id,
		slug: review.slug,
		title: review.title,
		score: review.score,
		author: review.user?.username ?? "Anônimo",
		date: formatRelativeDate(review.createdAt),
		commentsCount: review.commentsCount ?? 0,
		excerpt: truncate(review.content, 180),
		vehicle:
			brand && model && year
				? {
						brand,
						model,
						year,
					}
				: undefined,
	};
}

export type ReviewDetail = PublicReview & {
	content: string;
	pros: string | null;
	cons: string | null;
	createdAt: string;
};

function toReviewDetail(review: ApiReview): ReviewDetail {
	return {
		...toPublicReview(review),
		content: review.content,
		pros: review.pros ?? null,
		cons: review.cons ?? null,
		createdAt: review.createdAt,
	};
}

function toReviewComment(comment: NonNullable<CommentResponse["comments"]>[number]): ReviewComment {
	return {
		id: comment.id,
		reviewId: comment.reviewId,
		userId: comment.userId,
		content: comment.content,
		createdAt: comment.createdAt,
		author: comment.user?.username ?? "Anônimo",
		date: formatRelativeDate(comment.createdAt),
	};
}

export async function fetchPublicReviews(): Promise<PublicReview[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/reviews`, {
			cache: "no-store",
		});

		if (!response.ok) {
			return [];
		}

		const data = (await response.json()) as ReviewsResponse;

		return (data.reviews ?? [])
			.slice()
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.map(toPublicReview);
	} catch {
		return [];
	}
}

export async function fetchReviewBySlug(
	slug: string,
): Promise<ReviewDetail | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/reviews/slug/${slug}`, {
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as ReviewResponse;

		return data.review ? toReviewDetail(data.review) : null;
	} catch {
		return null;
	}
}

export async function fetchReviewComments(
	reviewId: string,
): Promise<ReviewComment[]> {
	try {
		const response = await fetch(
			`${API_BASE_URL}/reviews/${reviewId}/comments`,
			{
				cache: "no-store",
			},
		);

		if (!response.ok) {
			return [];
		}

		const data = (await response.json()) as CommentResponse;

		return (data.comments ?? []).map(toReviewComment);
	} catch {
		return [];
	}
}
