import { plainToInstance } from "class-transformer";
import { VoteResponseDto } from "../dtos/upsert-vote.dto";
import { ReviewVoteEntity } from "../entities/review-vote.entity";

export class VotesMapper {
	static toVoteResponseDto(vote: ReviewVoteEntity): VoteResponseDto {
		return plainToInstance(VoteResponseDto, vote, {
			excludeExtraneousValues: true,
		});
	}
}
