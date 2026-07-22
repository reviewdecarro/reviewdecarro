import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostsRepositoryProps } from "../../forum/repositories/forum-posts.repository";
import { ForumTopicsRepositoryProps } from "../../forum/repositories/forum-topics.repository";
import { DeleteForumTopicUseCase } from "../../forum/use-cases/delete-forum-topic.usecase";
import type { UserEntity } from "../../users/entities/user.entity";
import {
	type AdminListQuery,
	createPaginationMeta,
	mapAdminForumPost,
	mapAdminForumTopic,
	normalizePagination,
} from "../admin.types";

@Injectable()
export class AdminListForumTopicsUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute(query: AdminListQuery) {
		const pagination = normalizePagination(query);
		const result = await this.forumTopicsRepository.findManyForAdmin({
			query: query.q,
			...pagination,
		});

		return {
			topics: result.topics.map((topic) => {
				const mapped = mapAdminForumTopic(topic);

				return {
					id: mapped.id,
					slug: mapped.slug,
					title: mapped.title,
					author: mapped.author,
					postsCount: mapped.postsCount,
					upvotes: mapped.upvotes,
					downvotes: mapped.downvotes,
					status: mapped.status,
					createdAt: mapped.createdAt,
				};
			}),
			meta: createPaginationMeta(pagination, result.total),
		};
	}
}

@Injectable()
export class AdminGetForumTopicUseCase {
	constructor(
		private forumTopicsRepository: ForumTopicsRepositoryProps,
		private forumPostsRepository: ForumPostsRepositoryProps,
	) {}

	async execute(id: string) {
		const topic = await this.forumTopicsRepository.findByIdForAdmin(id);

		if (!topic) {
			throw new BadRequestError("Forum topic not found");
		}

		const recentPosts = await this.forumPostsRepository.findRecentByTopicId(
			id,
			5,
		);
		const mapped = mapAdminForumTopic(topic);

		return {
			...mapped,
			recentPosts: recentPosts.map(mapAdminForumPost),
			metrics: {
				postsCount: mapped.postsCount,
				upvotes: mapped.upvotes,
				downvotes: mapped.downvotes,
			},
		};
	}
}

@Injectable()
export class AdminDeleteForumTopicUseCase {
	constructor(private deleteForumTopicUseCase: DeleteForumTopicUseCase) {}

	async execute(admin: UserEntity, topicId: string): Promise<void> {
		await this.deleteForumTopicUseCase.execute(admin, topicId);
	}
}
