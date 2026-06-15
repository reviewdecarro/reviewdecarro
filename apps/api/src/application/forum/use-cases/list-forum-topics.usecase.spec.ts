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

	it("should filter topics by title or content case-insensitively", async () => {
		topicsRepository.items.push(
			new ForumTopicEntity({
				id: "topic-title",
				authorId: "user-1",
				title: "Manutenção preventiva",
				slug: "manutencao-preventiva",
				content: "Conteúdo geral",
				status: "PUBLISHED" as never,
				postsCount: 0,
				upvotes: 0,
				downvotes: 0,
				createdAt: new Date("2024-01-01T10:00:00.000Z"),
				updatedAt: new Date("2024-01-01T10:00:00.000Z"),
				deletedAt: null,
			}),
			new ForumTopicEntity({
				id: "topic-content",
				authorId: "user-2",
				title: "Dúvida geral",
				slug: "duvida-geral",
				content: "Experiência com carros híbridos",
				status: "PUBLISHED" as never,
				postsCount: 0,
				upvotes: 0,
				downvotes: 0,
				createdAt: new Date("2024-01-02T10:00:00.000Z"),
				updatedAt: new Date("2024-01-02T10:00:00.000Z"),
				deletedAt: null,
			}),
		);

		await expect(sut.execute({ query: "MANUTENÇÃO" })).resolves.toEqual([
			expect.objectContaining({ id: "topic-title" }),
		]);
		await expect(sut.execute({ query: "híbridos" })).resolves.toEqual([
			expect.objectContaining({ id: "topic-content" }),
		]);
		await expect(sut.execute({ query: "inexistente" })).resolves.toEqual([]);
	});
});
