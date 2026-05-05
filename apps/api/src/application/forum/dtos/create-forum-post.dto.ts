import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateForumPostDto {
  @ApiProperty({ example: "Concordo com o post anterior..." })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly content: string;

  @ApiPropertyOptional({ example: "uuid-parent-post-id" })
  @IsUUID()
  @IsOptional()
  readonly parentPostId?: string;
}

export class ForumPostResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() topicId: string;
  @ApiProperty() @Expose() authorId: string;
  @ApiPropertyOptional() @Expose() parentPostId: string | null;
  @ApiProperty() @Expose() content: string;
  @ApiProperty() @Expose() status: string;
  @ApiProperty() @Expose() upvotes: number;
  @ApiProperty() @Expose() downvotes: number;
  @ApiProperty() @Expose() createdAt: Date;
  @ApiProperty() @Expose() updatedAt: Date;
  @ApiPropertyOptional() @Expose() deletedAt: Date | null;
}
