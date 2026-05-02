import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { UserEntity } from "../../users/entities/user.entity";
import { CommentsRepositoryProps } from "../repositories/comments.repository";

@Injectable()
export class DeleteCommentUseCase {
	constructor(
		private commentsRepository: CommentsRepositoryProps,
		private reviewsRepository: ReviewsRepositoryProps,
	) {}

	async execute(user: UserEntity, reviewId: string, commentId: string) {
		const comment = await this.commentsRepository.findById(commentId);

		if (!comment || comment.reviewId !== reviewId) {
			throw new BadRequestError("Comment not found");
		}

		const isAdmin = user.roles?.some((role) => role.name === "admin");

		if (comment.userId !== user.id && !isAdmin) {
			throw new BadRequestError("You can only delete your own comments");
		}

		await this.commentsRepository.delete(commentId);
		await this.reviewsRepository.decrementCommentsCount(reviewId);
	}
}
