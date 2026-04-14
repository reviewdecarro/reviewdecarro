import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { UpsertVoteDto } from "../dtos/upsert-vote.dto";
import { ReviewVoteEntity } from "../entities/review-vote.entity";
import { toVoteResponseDto } from "../mappers/vote.mapper";
import { VotesRepositoryProps } from "../repositories/votes.repository";

@Injectable()
export class UpsertVoteUseCase {
	constructor(
		private votesRepository: VotesRepositoryProps,
		private reviewsRepository: ReviewsRepositoryProps,
	) {}

	async execute(userId: string, reviewId: string, data: UpsertVoteDto) {
		const review = await this.reviewsRepository.findById(reviewId);

		if (!review) {
			throw new BadRequestError("Review not found");
		}

		const vote = await this.votesRepository.upsert(
			userId,
			reviewId,
			data.type,
		);

		return toVoteResponseDto(new ReviewVoteEntity(vote));
	}
}
