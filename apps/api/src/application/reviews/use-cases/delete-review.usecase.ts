import { Injectable, Optional } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../../users/entities/user.entity";
import { SearchIndexerService } from "../../search/services/search-indexer.service";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class DeleteReviewUseCase {
	constructor(
		private reviewsRepository: ReviewsRepositoryProps,
		@Optional() private searchIndexer?: SearchIndexerService,
	) {}

	async execute(user: UserEntity, reviewId: string) {
		const review = await this.reviewsRepository.findById(reviewId);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		const isAdmin = user.roles?.some((role) => role.name === "admin");

		if (review.userId !== user.id && !isAdmin) {
			throw new BadRequestError("You can only delete your own reviews");
		}

		await this.reviewsRepository.delete(reviewId);
		await this.searchIndexer?.removeReview(reviewId);
	}
}
