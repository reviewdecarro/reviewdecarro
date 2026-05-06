import { beforeEach, describe, expect, it } from "@jest/globals";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { DeleteForumTopicUseCase } from "./delete-forum-topic.usecase";

describe("DeleteForumTopicUseCase", () => {
	let topicsRepository: InMemoryForumTopicsRepository;
	let sut: DeleteForumTopicUseCase;

	beforeEach(() => {
		topicsRepository = new InMemoryForumTopicsRepository();
		sut = new DeleteForumTopicUseCase(topicsRepository);
	});

	function seedTopic() {
		const topic = new ForumTopicEntity({
			id: "topic-1",
			authorId: "user-1",
			title: "Título",
			slug: "titulo",
			content: "Conteúdo",
			status: ForumTopicStatus.PUBLISHED,
			viewsCount: 0,
			postsCount: 0,
			upvotes: 0,
			downvotes: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});

		topicsRepository.items.push(topic);
		return topic;
	}

	it("should soft delete a topic when author requests it", async () => {
		const topic = seedTopic();

		await sut.execute(
			{
				id: "user-1",
				roles: [],
			} as never,
			topic.id,
		);

		expect(topicsRepository.items[0]?.status).toBe(ForumTopicStatus.DELETED);
		expect(topicsRepository.items[0]?.deletedAt).toBeInstanceOf(Date);
	});

	it("should throw BadRequestError when topic not found", async () => {
		await expect(
			sut.execute(
				{
					id: "user-1",
					roles: [],
				} as never,
				"unknown",
			),
		).rejects.toThrow(BadRequestError);
	});
});
