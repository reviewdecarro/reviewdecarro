import { plainToInstance } from "class-transformer";
import { ForumPostResponseDto } from "../dtos/create-forum-post.dto";
import { ForumPostEntity } from "../entities/forum-post.entity";

export class ForumPostMapper {
  static toResponseDto(post: ForumPostEntity): ForumPostResponseDto {
    return plainToInstance(ForumPostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }
}
