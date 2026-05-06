import { beforeEach, describe, expect, it } from "@jest/globals";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { InMemoryForumPostsRepository } from "../repositories/in-memory-forum-posts.repository";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { CreateForumPostUseCase } from "./create-forum-post.usecase";

describe("CreateForumPostUseCase", () => {
	let topicsRepository: InMemoryForumTopicsRepository;
	let postsRepository: InMemoryForumPostsRepository;
	let sut: CreateForumPostUseCase;

	beforeEach(() => {
		topicsRepository = new InMemoryForumTopicsRepository();
		postsRepository = new InMemoryForumPostsRepository();
		sut = new CreateForumPostUseCase(topicsRepository, postsRepository);
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

	it("should create a root post", async () => {
		const topic = seedTopic();

		const result = await sut.execute("user-2", topic.id, {
			content: "Primeira resposta",
		});

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("topicId", topic.id);
		expect(result).toHaveProperty("authorId", "user-2");
		expect(result).toHaveProperty("content", "Primeira resposta");
		expect(postsRepository.items).toHaveLength(1);
		expect(topicsRepository.items[0]?.postsCount).toBe(1);
	});

	it("should create a reply when parent post exists in the same topic", async () => {
		const topic = seedTopic();
		const parent = new ForumPostEntity({
			id: "post-1",
			topicId: topic.id,
			authorId: "user-2",
			parentPostId: null,
			content: "Primeira resposta",
			status: "PUBLISHED" as never,
			upvotes: 0,
			downvotes: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});
		postsRepository.items.push(parent);

		const result = await sut.execute("user-3", topic.id, {
			content: "Resposta aninhada",
			parentPostId: parent.id,
		});

		expect(result).toHaveProperty("parentPostId", parent.id);
		expect(postsRepository.items).toHaveLength(2);
		expect(topicsRepository.items[0]?.postsCount).toBe(1);
	});

	it("should throw BadRequestError when topic not found", async () => {
		await expect(
			sut.execute("user-1", "unknown", {
				content: "Resposta",
			}),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute("user-1", "unknown", {
				content: "Resposta",
			}),
		).rejects.toThrow("Forum topic not found");
	});
});
