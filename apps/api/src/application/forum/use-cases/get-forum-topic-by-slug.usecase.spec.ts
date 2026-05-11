import { beforeEach, describe, expect, it } from "@jest/globals";
import {
	ForumPostStatus,
	ForumTopicStatus,
} from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { InMemoryForumPostsRepository } from "../repositories/in-memory-forum-posts.repository";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { GetForumTopicBySlugUseCase } from "./get-forum-topic-by-slug.usecase";

describe("GetForumTopicBySlugUseCase", () => {
	let topicsRepository: InMemoryForumTopicsRepository;
	let postsRepository: InMemoryForumPostsRepository;
	let sut: GetForumTopicBySlugUseCase;

	beforeEach(() => {
		topicsRepository = new InMemoryForumTopicsRepository();
		postsRepository = new InMemoryForumPostsRepository();
		sut = new GetForumTopicBySlugUseCase(topicsRepository, postsRepository);
	});

	function seedTopic() {
		const topic = new ForumTopicEntity({
			id: "topic-1",
			authorId: "user-1",
			title: "SUV para família",
			slug: "suv-para-familia",
			content: "Conteúdo do tópico",
			status: ForumTopicStatus.PUBLISHED,
			postsCount: 2,
			upvotes: 4,
			downvotes: 1,
			createdAt: new Date("2024-01-01T10:00:00.000Z"),
			updatedAt: new Date("2024-01-01T10:00:00.000Z"),
			deletedAt: null,
			author: { id: "user-1", username: "joao" },
		});

		topicsRepository.items.push(topic);

		postsRepository.items.push(
			new ForumPostEntity({
				id: "post-1",
				topicId: topic.id,
				authorId: "user-2",
				parentPostId: null,
				content: "Primeira resposta",
				status: ForumPostStatus.PUBLISHED,
				upvotes: 1,
				downvotes: 0,
				createdAt: new Date("2024-01-02T10:00:00.000Z"),
				updatedAt: new Date("2024-01-02T10:00:00.000Z"),
				deletedAt: null,
				author: { id: "user-2", username: "maria" },
			}),
			new ForumPostEntity({
				id: "post-2",
				topicId: topic.id,
				authorId: "user-3",
				parentPostId: "post-1",
				content: "Resposta aninhada",
				status: ForumPostStatus.PUBLISHED,
				upvotes: 0,
				downvotes: 0,
				createdAt: new Date("2024-01-03T10:00:00.000Z"),
				updatedAt: new Date("2024-01-03T10:00:00.000Z"),
				deletedAt: null,
				author: { id: "user-3", username: "ana" },
			}),
		);

		return topic;
	}

	it("should return topic with nested replies", async () => {
		const topic = seedTopic();

		const result = await sut.execute(topic.slug);

		expect(result).toHaveProperty("slug", topic.slug);
		expect(result).toHaveProperty("postsCount", 2);
		expect(result.posts).toHaveLength(1);
		expect(result.posts?.[0]).toHaveProperty("id", "post-1");
		expect(result.posts?.[0]?.replies).toHaveLength(1);
		expect(result.posts?.[0]?.replies?.[0]).toHaveProperty("id", "post-2");
	});

	it("should not promote replies whose parent is not publicly visible", async () => {
		const topic = seedTopic();

		postsRepository.items[0]!.status = ForumPostStatus.DELETED;
		postsRepository.items[0]!.deletedAt = new Date("2024-01-04T10:00:00.000Z");

		const result = await sut.execute(topic.slug);

		expect(result.posts).toHaveLength(0);
	});

	it("should throw BadRequestError when topic not found", async () => {
		await expect(sut.execute("unknown")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("unknown")).rejects.toThrow(
			"Forum topic not found",
		);
	});
});
