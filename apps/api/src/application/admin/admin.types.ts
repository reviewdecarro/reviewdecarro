import type { ForumPostEntity } from "../forum/entities/forum-post.entity";
import type { ForumTopicEntity } from "../forum/entities/forum-topic.entity";
import type { ReviewEntity } from "../reviews/entities/review.entity";
import type { UserEntity } from "../users/entities/user.entity";

export type PaginationParams = {
	page?: number | string;
	limit?: number | string;
};

export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type AdminListQuery = PaginationParams & {
	q?: string;
};

export function normalizePagination(params: PaginationParams): {
	page: number;
	limit: number;
} {
	const page = Math.max(Number(params.page) || 1, 1);
	const requestedLimit = Number(params.limit) || 10;
	const limit = Math.min(Math.max(requestedLimit, 1), 50);

	return { page, limit };
}

export function createPaginationMeta(
	params: { page: number; limit: number },
	total: number,
): PaginationMeta {
	return {
		page: params.page,
		limit: params.limit,
		total,
		totalPages: Math.ceil(total / params.limit),
	};
}

export function mapAdminUser(user: UserEntity) {
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		active: user.active,
		confirmedEmail: user.confirmedEmail,
		roles: user.roles?.map((role) => role.name) ?? [],
		createdAt: user.createdAt,
	};
}

export function mapAdminReview(review: ReviewEntity) {
	const carVersion = review.carVersionYear?.carVersion;
	const model = carVersion?.model;

	return {
		id: review.id,
		slug: review.slug,
		title: review.title,
		content: review.content,
		pros: review.pros,
		cons: review.cons,
		ratings: review.ratings ?? [],
		author: review.user
			? {
					id: review.user.id,
					username: review.user.username,
				}
			: null,
		vehicle: {
			brand: model?.brand?.name ?? "",
			model: model?.name ?? "",
			version: carVersion?.versionName ?? "",
			year: review.carVersionYear?.year ?? null,
		},
		score: review.score,
		commentsCount: review.commentsCount,
		status: review.status,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt,
	};
}

export function mapAdminForumTopic(topic: ForumTopicEntity) {
	return {
		id: topic.id,
		slug: topic.slug,
		title: topic.title,
		content: topic.content,
		author: topic.author
			? {
					id: topic.author.id,
					username: topic.author.username,
				}
			: null,
		postsCount: topic.postsCount,
		upvotes: topic.upvotes,
		downvotes: topic.downvotes,
		status: topic.status,
		createdAt: topic.createdAt,
		updatedAt: topic.updatedAt,
	};
}

export function mapAdminForumPost(post: ForumPostEntity) {
	return {
		id: post.id,
		content: post.content,
		author: post.author
			? {
					id: post.author.id,
					username: post.author.username,
				}
			: null,
		createdAt: post.createdAt,
	};
}
