import { Injectable } from "@nestjs/common";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicMapper } from "../mappers/forum-topic.mapper";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class ListForumTopicsUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute(filters?: { query?: string; page?: number; limit?: number }) {
		const { topics, total } = await this.forumTopicsRepository.findAll(filters);

		const items = topics.map((topic) =>
			ForumTopicMapper.toResponseDto(new ForumTopicEntity(topic)),
		);

		const page = filters?.page ?? 1;
		const limit = filters?.limit ?? total;
		const totalPages =
			filters?.page && filters?.limit ? Math.ceil(total / filters.limit) : 1;

		return { items, meta: { page, limit, total, totalPages } };
	}
}
