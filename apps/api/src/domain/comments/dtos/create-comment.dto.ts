import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateCommentDto {
	@ApiProperty({ example: "Concordo totalmente com a review!" })
	@IsString()
	@MinLength(1)
	readonly content: string;
}

export class CommentResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	reviewId: string;

	@ApiProperty()
	@Expose()
	userId: string;

	@ApiProperty()
	@Expose()
	content: string;

	@ApiProperty()
	@Expose()
	createdAt: Date;
}
