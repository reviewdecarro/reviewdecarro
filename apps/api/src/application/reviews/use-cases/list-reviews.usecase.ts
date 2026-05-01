import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class ListReviewsUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(filters?: {
		carVersionId?: string;
		userId?: string;
		query?: string;
	}) {
		const reviews = await this.reviewsRepository.findAll(filters);

		return reviews.map((review) =>
			ReviewsMapper.toReviewResponseDto(new ReviewEntity(review)),
		);
	}
}
