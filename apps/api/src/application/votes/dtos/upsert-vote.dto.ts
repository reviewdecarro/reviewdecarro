import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";
import { VoteType } from "../../../../prisma/generated/enums";

export class UpsertVoteDto {
	@ApiProperty({ example: "UP", enum: ["UP", "DOWN"] })
	@IsEnum(VoteType)
	readonly type: VoteType;
}

export class VoteResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	userId: string;

	@ApiProperty()
	@Expose()
	reviewId: string;

	@ApiProperty({ enum: ["UP", "DOWN"] })
	@Expose()
	type: string;

	@ApiProperty()
	@Expose()
	createdAt: Date;
}
