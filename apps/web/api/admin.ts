import { API_BASE_URL } from "@/api/api";

export type AdminQuery = {
	q?: string;
	page?: number;
	limit?: number;
};

export type AdminSummary = {
	usersCount: number;
	reviewsCount: number;
	forumTopicsCount: number;
};

export type AdminUser = {
	id: string;
	username: string;
	email: string;
	active: boolean;
	confirmedEmail: boolean;
	roles: string[];
	createdAt: string;
	metrics?: {
		reviewsCount: number;
		forumTopicsCount: number;
	};
	[key: string]: unknown;
};

export type AdminReview = {
	id: string;
	slug: string;
	title: string;
	content?: string;
	score: number;
	commentsCount?: number;
	status?: string;
	createdAt: string;
	updatedAt?: string;
	author?: { id: string; username: string } | null;
	vehicle?: {
		brand?: string;
		model?: string;
		version?: string;
		year?: number | null;
	};
	metrics?: {
		commentsCount: number;
	};
	[key: string]: unknown;
};

export type AdminForumTopic = {
	id: string;
	slug?: string;
	title?: string;
	content?: string;
	postsCount?: number;
	upvotes?: number;
	downvotes?: number;
	createdAt?: string;
	updatedAt?: string;
	author?: { id?: string; username?: string; email?: string } | null;
	metrics?: {
		postsCount: number;
		upvotes: number;
		downvotes: number;
	};
	[key: string]: unknown;
};

export type AdminListResponse<T> = {
	items: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

type ResourceKey = "users" | "reviews" | "topics";

function buildUrl(path: string, query?: AdminQuery) {
	const searchParams = new URLSearchParams();
	const trimmedQuery = query?.q?.trim();

	if (trimmedQuery) searchParams.set("q", trimmedQuery);
	if (query?.page && query.page > 1) searchParams.set("page", String(query.page));
	if (query?.limit) searchParams.set("limit", String(query.limit));

	const queryString = searchParams.toString();
	return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ""}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		credentials: "include",
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`Admin request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return (await response.json()) as T;
}

async function requestList<T>(
	path: string,
	resourceKey: ResourceKey,
	query: AdminQuery = {},
): Promise<AdminListResponse<T>> {
	const response = await fetch(buildUrl(path, query), {
		credentials: "include",
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`Admin request failed with status ${response.status}`);
	}

	const data = (await response.json()) as Record<string, unknown>;
	const meta =
		data.meta && typeof data.meta === "object"
			? (data.meta as Record<string, unknown>)
			: data;
	const rawItems =
		data[resourceKey] ??
		data.items ??
		data.data ??
		(resourceKey === "topics" ? data.forumTopics : undefined);
	const items = Array.isArray(rawItems) ? (rawItems as T[]) : [];
	const page = toPositiveInt(meta.page, query.page ?? 1);
	const limit = toPositiveInt(meta.limit, query.limit ?? 20);
	const total = toNonNegativeInt(meta.total, items.length);
	const totalPages = toPositiveInt(
		meta.totalPages,
		Math.max(1, Math.ceil(total / limit)),
	);

	return { items, page, limit, total, totalPages };
}

function unwrapResource<T>(data: unknown, keys: string[]): T | null {
	if (!data || typeof data !== "object") return null;

	const record = data as Record<string, unknown>;
	for (const key of keys) {
		if (record[key] && typeof record[key] === "object") {
			return record[key] as T;
		}
	}

	return record as T;
}

function toPositiveInt(value: unknown, fallback: number) {
	const numberValue = Number(value);
	return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : fallback;
}

function toNonNegativeInt(value: unknown, fallback: number) {
	const numberValue = Number(value);
	return Number.isInteger(numberValue) && numberValue >= 0
		? numberValue
		: fallback;
}

export async function fetchAdminSummary() {
	return request<AdminSummary>("/admin/summary");
}

export async function fetchAdminUsers(query?: AdminQuery) {
	return requestList<AdminUser>("/admin/users", "users", query);
}

export async function fetchAdminUser(id: string) {
	const data = await request<unknown>(`/admin/users/${id}`);
	return unwrapResource<AdminUser>(data, ["user"]);
}

export async function deleteAdminUser(id: string) {
	await request<void>(`/admin/users/${id}`, { method: "DELETE" });
}

export async function fetchAdminReviews(query?: AdminQuery) {
	return requestList<AdminReview>("/admin/reviews", "reviews", query);
}

export async function fetchAdminReview(id: string) {
	const data = await request<unknown>(`/admin/reviews/${id}`);
	return unwrapResource<AdminReview>(data, ["review"]);
}

export async function deleteAdminReview(id: string) {
	await request<void>(`/admin/reviews/${id}`, { method: "DELETE" });
}

export async function fetchAdminForumTopics(query?: AdminQuery) {
	return requestList<AdminForumTopic>("/admin/forum/topics", "topics", query);
}

export async function fetchAdminForumTopic(id: string) {
	const data = await request<unknown>(`/admin/forum/topics/${id}`);
	return unwrapResource<AdminForumTopic>(data, ["topic"]);
}

export async function deleteAdminForumTopic(id: string) {
	await request<void>(`/admin/forum/topics/${id}`, { method: "DELETE" });
}
