import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { DeleteReviewUseCase } from "../../reviews/use-cases/delete-review.usecase";
import type { UserEntity } from "../../users/entities/user.entity";
import {
	type AdminListQuery,
	createPaginationMeta,
	mapAdminReview,
	normalizePagination,
} from "../admin.types";

@Injectable()
export class AdminListReviewsUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(query: AdminListQuery) {
		const pagination = normalizePagination(query);
		const result = await this.reviewsRepository.findManyForAdmin({
			query: query.q,
			...pagination,
		});

		return {
			reviews: result.reviews.map((review) => {
				const mapped = mapAdminReview(review);

				return {
					id: mapped.id,
					slug: mapped.slug,
					title: mapped.title,
					author: mapped.author,
					vehicle: mapped.vehicle,
					score: mapped.score,
					commentsCount: mapped.commentsCount,
					status: mapped.status,
					createdAt: mapped.createdAt,
				};
			}),
			meta: createPaginationMeta(pagination, result.total),
		};
	}
}

@Injectable()
export class AdminGetReviewUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

	async execute(id: string) {
		const review = await this.reviewsRepository.findByIdForAdmin(id);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		const mapped = mapAdminReview(review);

		return {
			...mapped,
			metrics: {
				commentsCount: mapped.commentsCount,
			},
		};
	}
}

@Injectable()
export class AdminDeleteReviewUseCase {
	constructor(private deleteReviewUseCase: DeleteReviewUseCase) {}

	async execute(admin: UserEntity, reviewId: string): Promise<void> {
		await this.deleteReviewUseCase.execute(admin, reviewId);
	}
}
