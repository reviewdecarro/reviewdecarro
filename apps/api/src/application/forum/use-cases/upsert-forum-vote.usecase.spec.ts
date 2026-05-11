import { beforeEach, describe, expect, it } from "@jest/globals";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { InMemoryForumPostsRepository } from "../repositories/in-memory-forum-posts.repository";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { InMemoryForumVotesRepository } from "../repositories/in-memory-forum-votes.repository";
import { UpsertForumVoteUseCase } from "./upsert-forum-vote.usecase";

describe("UpsertForumVoteUseCase", () => {
	let votesRepository: InMemoryForumVotesRepository;
	let topicsRepository: InMemoryForumTopicsRepository;
	let postsRepository: InMemoryForumPostsRepository;
	let sut: UpsertForumVoteUseCase;

	beforeEach(() => {
		votesRepository = new InMemoryForumVotesRepository();
		topicsRepository = new InMemoryForumTopicsRepository();
		postsRepository = new InMemoryForumPostsRepository();
		sut = new UpsertForumVoteUseCase(
			votesRepository,
			topicsRepository,
			postsRepository,
		);
	});

	function seedTopic() {
		const topic = new ForumTopicEntity({
			id: "topic-1",
			authorId: "user-1",
			title: "Título",
			slug: "titulo",
			content: "Conteúdo",
			status: ForumTopicStatus.PUBLISHED,
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

	function seedPost(topicId: string) {
		const post = new ForumPostEntity({
			id: "post-1",
			topicId,
			authorId: "user-2",
			parentPostId: null,
			content: "Resposta",
			status: "PUBLISHED" as never,
			upvotes: 0,
			downvotes: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});

		postsRepository.items.push(post);
		return post;
	}

	it("should create a topic vote", async () => {
		const topic = seedTopic();

		const result = await sut.execute(
			"user-1",
			"TOPIC" as never,
			topic.id,
			"UP" as never,
		);

		expect(result.action).toBe("created");
		expect(result.vote).toHaveProperty("targetId", topic.id);
		expect(votesRepository.items).toHaveLength(1);
		expect(topicsRepository.items[0]?.upvotes).toBe(1);
	});

	it("should remove a repeated vote on the same target", async () => {
		const topic = seedTopic();

		await sut.execute("user-1", "TOPIC" as never, topic.id, "UP" as never);
		const result = await sut.execute(
			"user-1",
			"TOPIC" as never,
			topic.id,
			"UP" as never,
		);

		expect(result.action).toBe("removed");
		expect(result.vote).toBeNull();
		expect(votesRepository.items).toHaveLength(0);
		expect(topicsRepository.items[0]?.upvotes).toBe(0);
	});

	it("should update a vote from up to down", async () => {
		const topic = seedTopic();

		await sut.execute("user-1", "TOPIC" as never, topic.id, "UP" as never);
		const result = await sut.execute(
			"user-1",
			"TOPIC" as never,
			topic.id,
			"DOWN" as never,
		);

		expect(result.action).toBe("updated");
		expect(result.vote).toHaveProperty("value", "DOWN");
		expect(topicsRepository.items[0]?.upvotes).toBe(0);
		expect(topicsRepository.items[0]?.downvotes).toBe(1);
	});

	it("should vote on a post", async () => {
		const topic = seedTopic();
		const post = seedPost(topic.id);

		const result = await sut.execute(
			"user-1",
			"POST" as never,
			post.id,
			"DOWN" as never,
		);

		expect(result.action).toBe("created");
		expect(result.vote).toHaveProperty("targetId", post.id);
		expect(postsRepository.items[0]?.downvotes).toBe(1);
	});

	it("should throw BadRequestError when target is not found", async () => {
		await expect(
			sut.execute("user-1", "TOPIC" as never, "unknown", "UP" as never),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute("user-1", "TOPIC" as never, "unknown", "UP" as never),
		).rejects.toThrow("Forum target not found");
	});
});
