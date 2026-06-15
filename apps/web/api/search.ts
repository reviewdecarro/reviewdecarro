import { API_BASE_URL } from "@/api/api";
import type { ForumTopicSummary, PublicReview } from "@/types";

export type SearchSort = "relevance" | "recent" | "popular";

type SearchItem = {
	id: string;
	entityId: string;
	entityType: "REVIEW" | "TOPIC";
	title: string;
	excerpt: string | null;
	authorName: string | null;
	brandName: string | null;
	modelName: string | null;
	versionName: string | null;
	year: number | null;
	slug: string;
	score: number;
	votesCount: number;
	commentsCount: number;
	createdAt: string;
};

type SearchResponse = {
	items: SearchItem[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

export type SearchPage<T> = {
	items: T[];
	meta: SearchResponse["meta"];
};

type SearchParams = {
	q: string;
	type: "review" | "topic";
	sort?: SearchSort;
	page?: number;
	limit?: number;
};

const emptyMeta = { page: 1, limit: 10, total: 0, totalPages: 0 };

function formatRelativeDate(dateValue: string) {
	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) return "";

	const diffMs = Date.now() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

	if (diffDays <= 0) return diffHours <= 0 ? "há instantes" : `há ${diffHours}h`;
	if (diffDays === 1) return "há 1 dia";
	if (diffDays < 30) return `há ${diffDays} dias`;

	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
}

async function fetchSearch(params: SearchParams): Promise<SearchResponse> {
	try {
		const searchParams = new URLSearchParams({
			q: params.q.trim(),
			type: params.type,
			sort: params.sort ?? "relevance",
			page: String(params.page ?? 1),
			limit: String(params.limit ?? 10),
		});
		const response = await fetch(`${API_BASE_URL}/search?${searchParams}`, {
			cache: "no-store",
		});

		if (!response.ok) return { items: [], meta: emptyMeta };
		return (await response.json()) as SearchResponse;
	} catch {
		return { items: [], meta: emptyMeta };
	}
}

export async function fetchReviewSearch(
	params: Omit<SearchParams, "type">,
): Promise<SearchPage<PublicReview>> {
	const result = await fetchSearch({ ...params, type: "review" });

	return {
		meta: result.meta,
		items: result.items.map((item) => ({
			id: item.entityId,
			slug: item.slug,
			title: item.title,
			score: item.score,
			author: item.authorName ?? "Anônimo",
			date: formatRelativeDate(item.createdAt),
			commentsCount: item.commentsCount,
			excerpt: item.excerpt ?? undefined,
			vehicle:
				item.brandName && item.modelName && item.year
					? { brand: item.brandName, model: item.modelName, year: item.year }
					: undefined,
		})),
	};
}

export async function fetchTopicSearch(
	params: Omit<SearchParams, "type">,
): Promise<SearchPage<ForumTopicSummary>> {
	const result = await fetchSearch({ ...params, type: "topic" });

	return {
		meta: result.meta,
		items: result.items.map((item) => ({
			id: item.entityId,
			slug: item.slug,
			title: item.title,
			author: item.authorName ?? "Anônimo",
			date: formatRelativeDate(item.createdAt),
			createdAt: item.createdAt,
			upvotes: Math.max(item.votesCount, 0),
			votes: item.votesCount,
			comments: item.commentsCount,
			body: item.excerpt ?? undefined,
		})),
	};
}
