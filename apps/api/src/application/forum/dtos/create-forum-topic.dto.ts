import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateForumTopicDto {
	@ApiProperty({ example: "Qual o melhor carro para família?" })
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	readonly title: string;

	@ApiProperty({ example: "Estou pensando em comprar um SUV..." })
	@IsString()
	@IsNotEmpty()
	@MinLength(10)
	readonly content: string;
}

export class ForumUserResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	username: string;
}

export class ForumTopicPostResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	topicId: string;

	@ApiProperty()
	@Expose()
	authorId: string;

	@ApiPropertyOptional()
	@Expose()
	parentPostId: string | null;

	@ApiProperty()
	@Expose()
	content: string;

	@ApiProperty()
	@Expose()
	status: string;

	@ApiProperty()
	@Expose()
	upvotes: number;

	@ApiProperty()
	@Expose()
	downvotes: number;

	@ApiProperty()
	@Expose()
	createdAt: Date;

	@ApiProperty()
	@Expose()
	updatedAt: Date;

	@ApiPropertyOptional()
	@Expose()
	deletedAt: Date | null;

	@ApiPropertyOptional({ type: () => ForumUserResponseDto })
	@Expose()
	@Type(() => ForumUserResponseDto)
	author?: ForumUserResponseDto;

	@ApiPropertyOptional({ type: () => [ForumTopicPostResponseDto] })
	@Expose()
	@Type(() => ForumTopicPostResponseDto)
	replies?: ForumTopicPostResponseDto[];
}

export class ForumTopicResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	authorId: string;

	@ApiProperty()
	@Expose()
	title: string;

	@ApiProperty()
	@Expose()
	slug: string;

	@ApiProperty()
	@Expose()
	content: string;

	@ApiProperty()
	@Expose()
	status: string;

	@ApiProperty()
	@Expose()
	viewsCount: number;

	@ApiProperty()
	@Expose()
	postsCount: number;

	@ApiProperty()
	@Expose()
	upvotes: number;

	@ApiProperty()
	@Expose()
	downvotes: number;

	@ApiProperty()
	@Expose()
	createdAt: Date;

	@ApiProperty()
	@Expose()
	updatedAt: Date;

	@ApiPropertyOptional()
	@Expose()
	deletedAt: Date | null;

	@ApiPropertyOptional({ type: () => ForumUserResponseDto })
	@Expose()
	@Type(() => ForumUserResponseDto)
	author?: ForumUserResponseDto;

	@ApiPropertyOptional({ type: () => [ForumTopicPostResponseDto] })
	@Expose()
	@Type(() => ForumTopicPostResponseDto)
	posts?: ForumTopicPostResponseDto[];
}
