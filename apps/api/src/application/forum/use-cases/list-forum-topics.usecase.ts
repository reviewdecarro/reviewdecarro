import { Injectable } from "@nestjs/common";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicMapper } from "../mappers/forum-topic.mapper";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class ListForumTopicsUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute() {
		const topics = await this.forumTopicsRepository.findAll();

		return topics.map((topic) =>
			ForumTopicMapper.toResponseDto(new ForumTopicEntity(topic)),
		);
	}
}
