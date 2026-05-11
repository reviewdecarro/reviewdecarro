import { plainToInstance } from "class-transformer";
import { ForumVoteResponseDto } from "../dtos/upsert-forum-vote.dto";
import { ForumVoteEntity } from "../entities/forum-vote.entity";

export class ForumVoteMapper {
	static toResponseDto(vote: ForumVoteEntity): ForumVoteResponseDto {
		return plainToInstance(ForumVoteResponseDto, vote, {
			excludeExtraneousValues: true,
		});
	}
}
