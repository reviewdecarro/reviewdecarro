import { Injectable, Optional } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { SearchIndexerService } from "../../search/services/search-indexer.service";
import { UpdateReviewDto } from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class UpdateReviewUseCase {
	constructor(
		private reviewsRepository: ReviewsRepositoryProps,
		@Optional() private searchIndexer?: SearchIndexerService,
	) {}

	async execute(userId: string, reviewId: string, data: UpdateReviewDto) {
		const review = await this.reviewsRepository.findById(reviewId);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		if (review.userId !== userId) {
			throw new BadRequestError("You can only edit your own reviews");
		}

		const updated = await this.reviewsRepository.update(reviewId, data);
		await this.searchIndexer?.indexReview(reviewId);

		return ReviewsMapper.toReviewResponseDto(new ReviewEntity(updated));
	}
}
