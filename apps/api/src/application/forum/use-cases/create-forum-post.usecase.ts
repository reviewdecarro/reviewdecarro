import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateForumPostDto } from "../dtos/create-forum-post.dto";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumPostMapper } from "../mappers/forum-post.mapper";
import { ForumPostsRepositoryProps } from "../repositories/forum-posts.repository";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class CreateForumPostUseCase {
	constructor(
		private forumTopicsRepository: ForumTopicsRepositoryProps,
		private forumPostsRepository: ForumPostsRepositoryProps,
	) {}

	async execute(userId: string, topicId: string, data: CreateForumPostDto) {
		const topic = await this.forumTopicsRepository.findById(topicId);

		if (!topic || topic.deletedAt) {
			throw new BadRequestError("Forum topic not found");
		}

		if (data.parentPostId) {
			const parentPost = await this.forumPostsRepository.findById(
				data.parentPostId,
			);

			if (
				!parentPost ||
				parentPost.deletedAt ||
				parentPost.topicId !== topicId
			) {
				throw new BadRequestError("Parent post not found");
			}
		}

		const post = await this.forumPostsRepository.create(topicId, userId, data);

		await this.forumTopicsRepository.incrementPostsCount(topicId);

		return ForumPostMapper.toResponseDto(new ForumPostEntity(post));
	}
}
