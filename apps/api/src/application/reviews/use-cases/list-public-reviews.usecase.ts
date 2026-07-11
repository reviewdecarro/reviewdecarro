import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class ListPublicReviewsUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(params?: { page?: number; limit?: number }) {
		const page = params?.page ?? 1;
		const limit = params?.limit ?? 12;

		const featuredEntity = await this.reviewsRepository.findFeatured();
		const { items, total } = await this.reviewsRepository.findPaginated({
			page,
			limit,
			excludeId: featuredEntity?.id,
		});

		const featured = featuredEntity
			? ReviewsMapper.toReviewResponseDto(new ReviewEntity(featuredEntity))
			: null;

		return {
			featured,
			items: items.map((review) =>
				ReviewsMapper.toReviewResponseDto(new ReviewEntity(review)),
			),
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}
}
