import { Injectable } from "@nestjs/common";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicMapper } from "../mappers/forum-topic.mapper";
import { ForumPostsRepositoryProps } from "../repositories/forum-posts.repository";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

function buildForumPostTree(posts: ForumPostEntity[]): ForumPostEntity[] {
	const byId = new Map<string, ForumPostEntity>();
	const roots: ForumPostEntity[] = [];

	for (const post of posts) {
		byId.set(post.id, new ForumPostEntity({ ...post, replies: [] }));
	}

	for (const post of byId.values()) {
		if (post.parentPostId) {
			const parent = byId.get(post.parentPostId);

			if (parent) {
				parent.replies = parent.replies ?? [];
				parent.replies.push(post);
			}

			continue;
		}

		roots.push(post);
	}

	return roots;
}

@Injectable()
export class GetForumTopicBySlugUseCase {
	constructor(
		private forumTopicsRepository: ForumTopicsRepositoryProps,
		private forumPostsRepository: ForumPostsRepositoryProps,
	) {}

	async execute(slug: string) {
		const topic = await this.forumTopicsRepository.findBySlug(slug);

		if (!topic || topic.deletedAt || topic.status !== ForumTopicStatus.PUBLISHED) {
			throw new BadRequestError("Forum topic not found");
		}

		const posts = await this.forumPostsRepository.findByTopicId(topic.id);
		const viewsCount = topic.viewsCount + 1;
		await this.forumTopicsRepository.incrementViewsCount(topic.id);

		const forumTopic = new ForumTopicEntity({
			...topic,
			viewsCount,
			posts: buildForumPostTree(posts),
		});

		return ForumTopicMapper.toResponseDto(forumTopic);
	}
}
