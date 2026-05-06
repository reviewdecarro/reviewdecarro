import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { slugify } from "../../../shared/utils/slugify";
import { CreateForumTopicDto } from "../dtos/create-forum-topic.dto";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicMapper } from "../mappers/forum-topic.mapper";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class CreateForumTopicUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute(userId: string, data: CreateForumTopicDto) {
		const slug = await this.buildUniqueSlug(data.title);
		const topic = await this.forumTopicsRepository.create(userId, {
			...data,
			slug,
		});

		return ForumTopicMapper.toResponseDto(new ForumTopicEntity(topic));
	}

	private async buildUniqueSlug(title: string): Promise<string> {
		const base = slugify(title);

		if (!base) {
			throw new BadRequestError("Cannot generate slug from title");
		}

		let candidate = base;
		let suffix = 2;

		while (await this.forumTopicsRepository.findBySlug(candidate)) {
			candidate = `${base}-${suffix}`;
			suffix += 1;
		}

		return candidate;
	}
}
