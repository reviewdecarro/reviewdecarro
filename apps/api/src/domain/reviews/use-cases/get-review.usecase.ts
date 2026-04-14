import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../entities/review.entity";
import { toReviewResponseDto } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class GetReviewUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(reviewId: string) {
		const review = await this.reviewsRepository.findById(reviewId);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		return toReviewResponseDto(new ReviewEntity(review));
	}
}
