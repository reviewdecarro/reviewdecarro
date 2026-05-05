import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CommentsMapper } from "../mappers/comment.mapper";
import { CommentsRepositoryProps } from "../repositories/comments.repository";

@Injectable()
export class CreateCommentUseCase {
	constructor(
		private commentsRepository: CommentsRepositoryProps,
		private reviewsRepository: ReviewsRepositoryProps,
	) {}

	async execute(reviewId: string, userId: string, data: CreateCommentDto) {
		const review = await this.reviewsRepository.findById(reviewId);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		const comment = await this.commentsRepository.create(
			reviewId,
			userId,
			data,
		);

		await this.reviewsRepository.incrementCommentsCount(reviewId);

		return CommentsMapper.toCommentResponseDto(new CommentEntity(comment));
	}
}
