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

		expect(result.items).toHaveLength(2);
		expect(result.items[0]).toHaveProperty("slug", "terceiro");
		expect(result.items[1]).toHaveProperty("slug", "primeiro");
		expect(result.meta).toEqual({ page: 1, limit: 2, total: 2, totalPages: 1 });
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

		expect((await sut.execute({ query: "MANUTENÇÃO" })).items).toEqual([
			expect.objectContaining({ id: "topic-title" }),
		]);
		expect((await sut.execute({ query: "híbridos" })).items).toEqual([
			expect.objectContaining({ id: "topic-content" }),
		]);
		expect((await sut.execute({ query: "inexistente" })).items).toEqual([]);
	});

	it("should paginate topics and report meta", async () => {
		for (let i = 0; i < 5; i++) {
			topicsRepository.items.push(
				new ForumTopicEntity({
					id: `topic-${i}`,
					authorId: "user-1",
					title: `Topico ${i}`,
					slug: `topico-${i}`,
					content: "Conteúdo",
					status: "PUBLISHED" as never,
					postsCount: 0,
					upvotes: 0,
					downvotes: 0,
					createdAt: new Date(2024, 0, i + 1),
					updatedAt: new Date(2024, 0, i + 1),
					deletedAt: null,
				}),
			);
		}

		const result = await sut.execute({ page: 1, limit: 2 });

		expect(result.items).toHaveLength(2);
		expect(result.meta).toEqual({
			page: 1,
			limit: 2,
			total: 5,
			totalPages: 3,
		});
	});
});
