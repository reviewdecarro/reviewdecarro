import { plainToInstance } from "class-transformer";
import { CommentResponseDto } from "../dtos/create-comment.dto";
import { CommentEntity } from "../entities/comment.entity";

export class CommentsMapper {
	static toCommentResponseDto(comment: CommentEntity): CommentResponseDto {
		return plainToInstance(CommentResponseDto, comment, {
			excludeExtraneousValues: true,
		});
	}
}
