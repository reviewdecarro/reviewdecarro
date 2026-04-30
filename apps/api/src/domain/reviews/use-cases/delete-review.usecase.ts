import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../../users/entities/user.entity";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class DeleteReviewUseCase {
	constructor(private reviewsRepository: ReviewsRepositoryProps) {}

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
	}
}
