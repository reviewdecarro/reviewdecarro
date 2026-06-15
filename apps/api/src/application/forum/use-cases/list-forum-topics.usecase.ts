import { Injectable } from "@nestjs/common";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicMapper } from "../mappers/forum-topic.mapper";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class ListForumTopicsUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute(filters?: { query?: string }) {
		const topics = await this.forumTopicsRepository.findAll(filters);

		return topics.map((topic) =>
			ForumTopicMapper.toResponseDto(new ForumTopicEntity(topic)),
		);
	}
}
