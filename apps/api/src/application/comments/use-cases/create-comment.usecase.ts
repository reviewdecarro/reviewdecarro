import { Injectable, Optional } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { SearchIndexerService } from "../../search/services/search-indexer.service";
import { CreateCommentDto } from "../dtos/create-comment.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CommentsMapper } from "../mappers/comment.mapper";
import { CommentsRepositoryProps } from "../repositories/comments.repository";

@Injectable()
export class CreateCommentUseCase {
	constructor(
		private commentsRepository: CommentsRepositoryProps,
		private reviewsRepository: ReviewsRepositoryProps,
		@Optional() private searchIndexer?: SearchIndexerService,
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
		await this.searchIndexer?.indexReview(reviewId);

		return CommentsMapper.toCommentResponseDto(new CommentEntity(comment));
	}
}
