import { plainToInstance } from "class-transformer";
import { ForumTopicResponseDto } from "../dtos/create-forum-topic.dto";
import { ForumTopicEntity } from "../entities/forum-topic.entity";

export class ForumTopicMapper {
	static toResponseDto(topic: ForumTopicEntity): ForumTopicResponseDto {
		return plainToInstance(ForumTopicResponseDto, topic, {
			excludeExtraneousValues: true,
		});
	}
}
