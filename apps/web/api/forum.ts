import { API_BASE_URL } from "@/api/api";
import type { ForumPost, ForumTopicDetail, ForumTopicSummary } from "@/types";

type ApiForumUser = {
	id: string;
	username: string;
};

type ApiForumPost = {
	id: string;
	topicId: string;
	authorId: string;
	parentPostId: string | null;
	content: string;
	upvotes: number;
	downvotes: number;
	createdAt: string;
	updatedAt: string;
	author?: ApiForumUser;
	replies?: ApiForumPost[];
};

type ApiForumTopic = {
	id: string;
	authorId: string;
	title: string;
	slug: string;
	content: string;
	postsCount: number;
	upvotes: number;
	downvotes: number;
	createdAt: string;
	updatedAt: string;
	author?: ApiForumUser;
	posts?: ApiForumPost[];
};

type ForumTopicsResponse = {
	topics?: ApiForumTopic[];
};

export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

type ForumTopicsPageResponse = {
	topics?: ApiForumTopic[];
	meta?: PaginationMeta;
};

type ForumTopicResponse = {
	topic?: ApiForumTopic;
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

function toForumPost(post: ApiForumPost): ForumPost {
	return {
		id: post.id,
		topicId: post.topicId,
		authorId: post.authorId,
		parentPostId: post.parentPostId,
		content: post.content,
		upvotes: post.upvotes,
		downvotes: post.downvotes,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
		author: post.author?.username ?? "Anônimo",
		date: formatRelativeDate(post.createdAt),
		replies: (post.replies ?? []).map(toForumPost),
	};
}

function toForumTopicSummary(topic: ApiForumTopic): ForumTopicSummary {
	return {
		id: topic.id,
		slug: topic.slug,
		title: topic.title,
		author: topic.author?.username ?? "Anônimo",
		date: formatRelativeDate(topic.createdAt),
		createdAt: topic.createdAt,
		upvotes: topic.upvotes,
		votes: topic.upvotes - topic.downvotes,
		comments: topic.postsCount,
		body: truncate(topic.content, 220),
	};
}

function toForumTopicDetail(topic: ApiForumTopic): ForumTopicDetail {
	return {
		...toForumTopicSummary(topic),
		content: topic.content,
		createdAt: topic.createdAt,
		updatedAt: topic.updatedAt,
		posts: (topic.posts ?? []).map(toForumPost),
	};
}

type ForumTopicsFilters = {
	query?: string;
};

export async function fetchForumTopics(
	filters: ForumTopicsFilters = {},
): Promise<ForumTopicSummary[]> {
	try {
		const searchParams = new URLSearchParams();
		const query = filters.query?.trim();

		if (query) {
			searchParams.set("q", query);
		}

		const queryString = searchParams.toString();
		const response = await fetch(
			`${API_BASE_URL}/forum/topics${queryString ? `?${queryString}` : ""}`,
			{
				cache: "no-store",
			},
		);

		if (!response.ok) {
			return [];
		}

		const data = (await response.json()) as ForumTopicsResponse;

		return (data.topics ?? []).map(toForumTopicSummary);
	} catch {
		return [];
	}
}

export async function fetchForumTopicsPage(params: {
	page: number;
	limit?: number;
}): Promise<{ items: ForumTopicSummary[]; meta: PaginationMeta }> {
	const limit = params.limit ?? 30;
	const emptyMeta: PaginationMeta = { page: 1, limit, total: 0, totalPages: 0 };

	try {
		const searchParams = new URLSearchParams({
			page: String(params.page),
			limit: String(limit),
		});
		const response = await fetch(
			`${API_BASE_URL}/forum/topics?${searchParams.toString()}`,
			{ cache: "no-store" },
		);

		if (!response.ok) {
			return { items: [], meta: emptyMeta };
		}

		const data = (await response.json()) as ForumTopicsPageResponse;

		return {
			items: (data.topics ?? []).map(toForumTopicSummary),
			meta: data.meta ?? emptyMeta,
		};
	} catch {
		return { items: [], meta: emptyMeta };
	}
}

export async function fetchForumTopicBySlug(
	slug: string,
): Promise<ForumTopicDetail | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/forum/topics/${slug}`, {
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as ForumTopicResponse;

		return data.topic ? toForumTopicDetail(data.topic) : null;
	} catch {
		return null;
	}
}
