import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

export enum ForumVoteValue {
  UP = "UP",
  DOWN = "DOWN",
}

export class UpsertForumVoteDto {
  @ApiProperty({ example: "UP", enum: ["UP", "DOWN"] })
  @IsEnum(ForumVoteValue)
  readonly value: ForumVoteValue;
}

export class ForumVoteResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() userId: string;
  @ApiProperty() @Expose() targetId: string;
  @ApiProperty() @Expose() targetType: string;
  @ApiProperty({ enum: ["UP", "DOWN"] }) @Expose() value: string;
  @ApiProperty() @Expose() createdAt: Date;
  @ApiProperty() @Expose() updatedAt: Date;
}
