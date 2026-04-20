import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { VersionsRepositoryProps } from "../../cars/repositories/versions.repository";
import { CreateReviewDto } from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class CreateReviewUseCase {
	constructor(
		private reviewsRepository: ReviewsRepositoryProps,
		private versionsRepository: VersionsRepositoryProps,
	) {}

	async execute(userId: string, data: CreateReviewDto) {
		const version = await this.versionsRepository.findById(data.carVersionId);

		if (!version) {
			throw new BadRequestError("Car version not found");
		}

		const review = await this.reviewsRepository.create(userId, data);

		return ReviewsMapper.toReviewResponseDto(new ReviewEntity(review));
	}
}
