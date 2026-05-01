import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class GetReviewBySlugUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(slug: string) {
		const review = await this.reviewsRepository.findBySlug(slug);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		return ReviewsMapper.toReviewResponseDto(new ReviewEntity(review));
	}
}
