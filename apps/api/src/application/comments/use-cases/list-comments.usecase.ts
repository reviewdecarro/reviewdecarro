import { Injectable } from "@nestjs/common";
import { CommentEntity } from "../entities/comment.entity";
import { CommentsMapper } from "../mappers/comment.mapper";
import { CommentsRepositoryProps } from "../repositories/comments.repository";

@Injectable()
export class ListCommentsUseCase {
	constructor(private commentsRepository: CommentsRepositoryProps) {}

	async execute(reviewId: string) {
		const comments = await this.commentsRepository.findByReviewId(reviewId);

		return comments.map((comment) =>
			CommentsMapper.toCommentResponseDto(new CommentEntity(comment)),
		);
	}
}
