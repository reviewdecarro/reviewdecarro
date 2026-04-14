import { Injectable } from "@nestjs/common";
import { CommentEntity } from "../entities/comment.entity";
import { toCommentResponseDto } from "../mappers/comment.mapper";
import { CommentsRepositoryProps } from "../repositories/comments.repository";

@Injectable()
export class ListCommentsUseCase {
	constructor(private commentsRepository: CommentsRepositoryProps) {}

	async execute(reviewId: string) {
		const comments = await this.commentsRepository.findByReviewId(reviewId);

		return comments.map((comment) =>
			toCommentResponseDto(new CommentEntity(comment)),
		);
	}
}
