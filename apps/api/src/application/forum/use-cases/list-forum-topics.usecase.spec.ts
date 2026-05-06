import { beforeEach, describe, expect, it } from "@jest/globals";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { ListForumTopicsUseCase } from "./list-forum-topics.usecase";

describe("ListForumTopicsUseCase", () => {
	let topicsRepository: InMemoryForumTopicsRepository;
	let sut: ListForumTopicsUseCase;

	beforeEach(() => {
		topicsRepository = new InMemoryForumTopicsRepository();
		sut = new ListForumTopicsUseCase(topicsRepository);
	});

	it("should list only published topics ordered by newest first", async () => {
		topicsRepository.items.push(
			new ForumTopicEntity({
				id: "topic-1",
				authorId: "user-1",
				title: "Primeiro",
				slug: "primeiro",
				content: "Conteúdo 1",
				status: "PUBLISHED" as never,
				viewsCount: 1,
				postsCount: 0,
				upvotes: 2,
				downvotes: 0,
				createdAt: new Date("2024-01-01T10:00:00.000Z"),
				updatedAt: new Date("2024-01-01T10:00:00.000Z"),
				deletedAt: null,
			}),
			new ForumTopicEntity({
				id: "topic-2",
				authorId: "user-2",
				title: "Segundo",
				slug: "segundo",
				content: "Conteúdo 2",
				status: "DELETED" as never,
				viewsCount: 0,
				postsCount: 0,
				upvotes: 0,
				downvotes: 0,
				createdAt: new Date("2024-01-02T10:00:00.000Z"),
				updatedAt: new Date("2024-01-02T10:00:00.000Z"),
				deletedAt: new Date("2024-01-02T10:00:00.000Z"),
			}),
			new ForumTopicEntity({
				id: "topic-3",
				authorId: "user-3",
				title: "Terceiro",
				slug: "terceiro",
				content: "Conteúdo 3",
				status: "PUBLISHED" as never,
				viewsCount: 3,
				postsCount: 1,
				upvotes: 0,
				downvotes: 0,
				createdAt: new Date("2024-02-01T10:00:00.000Z"),
				updatedAt: new Date("2024-02-01T10:00:00.000Z"),
				deletedAt: null,
			}),
		);

		const result = await sut.execute();

		expect(result).toHaveLength(2);
		expect(result[0]).toHaveProperty("slug", "terceiro");
		expect(result[1]).toHaveProperty("slug", "primeiro");
	});
});
