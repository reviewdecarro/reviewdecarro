import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";
import {
	ForumVoteTargetType,
	ForumVoteValue,
} from "../../../../prisma/generated/enums";

export class UpsertForumVoteDto {
	@ApiProperty({ example: "UP", enum: ["UP", "DOWN"] })
	@IsEnum(ForumVoteValue)
	readonly value: ForumVoteValue;
}

export class ForumVoteResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	userId: string;

	@ApiProperty()
	@Expose()
	targetId: string;

	@ApiProperty({ enum: ["TOPIC", "POST"] })
	@Expose()
	targetType: ForumVoteTargetType;

	@ApiProperty({ enum: ["UP", "DOWN"] })
	@Expose()
	value: ForumVoteValue;

	@ApiProperty()
	@Expose()
	createdAt: Date;

	@ApiProperty()
	@Expose()
	updatedAt: Date;
}
