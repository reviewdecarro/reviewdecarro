import { Injectable, Optional } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { SearchIndexerService } from "../../search/services/search-indexer.service";
import { UserEntity } from "../../users/entities/user.entity";
import { ForumPostsRepositoryProps } from "../repositories/forum-posts.repository";

@Injectable()
export class DeleteForumPostUseCase {
	constructor(
		private forumPostsRepository: ForumPostsRepositoryProps,
		@Optional() private searchIndexer?: SearchIndexerService,
	) {}

	async execute(user: UserEntity, postId: string) {
		const post = await this.forumPostsRepository.findById(postId);

		if (!post || post.deletedAt) {
			throw new BadRequestError("Forum post not found");
		}

		const isAuthor = post.authorId === user.id;
		const isAdmin = user.roles?.some((role) => role.name === "ADMIN") ?? false;

		if (!isAuthor && !isAdmin) {
			throw new BadRequestError("Not allowed");
		}

		await this.forumPostsRepository.delete(postId);
		await this.searchIndexer?.indexTopic(post.topicId);
	}
}
