import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../../users/entities/user.entity";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";

@Injectable()
export class DeleteForumTopicUseCase {
	constructor(private forumTopicsRepository: ForumTopicsRepositoryProps) {}

	async execute(user: UserEntity, topicId: string) {
		const topic = await this.forumTopicsRepository.findById(topicId);

		if (!topic || topic.deletedAt) {
			throw new BadRequestError("Forum topic not found");
		}

		const isAuthor = topic.authorId === user.id;
		const isAdmin = user.roles?.some((role) => role.name === "ADMIN") ?? false;

		if (!isAuthor && !isAdmin) {
			throw new BadRequestError("Not allowed");
		}

		await this.forumTopicsRepository.delete(topicId);
	}
}
