import { beforeEach, describe, expect, it } from "@jest/globals";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { InMemoryForumPostsRepository } from "../repositories/in-memory-forum-posts.repository";
import { InMemoryForumTopicsRepository } from "../repositories/in-memory-forum-topics.repository";
import { DeleteForumPostUseCase } from "./delete-forum-post.usecase";

describe("DeleteForumPostUseCase", () => {
	let topicsRepository: InMemoryForumTopicsRepository;
	let postsRepository: InMemoryForumPostsRepository;
	let sut: DeleteForumPostUseCase;

	beforeEach(() => {
		topicsRepository = new InMemoryForumTopicsRepository();
		postsRepository = new InMemoryForumPostsRepository();
		sut = new DeleteForumPostUseCase(postsRepository);
	});

	function seedPost() {
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

		const post = new ForumPostEntity({
			id: "post-1",
			topicId: topic.id,
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

	it("should soft delete a post when author requests it", async () => {
		const post = seedPost();

		await sut.execute(
			{
				id: "user-2",
				roles: [],
			} as never,
			post.id,
		);

		expect(postsRepository.items[0]?.status).toBe("DELETED");
		expect(postsRepository.items[0]?.deletedAt).toBeInstanceOf(Date);
	});

	it("should throw BadRequestError when post not found", async () => {
		await expect(
			sut.execute(
				{
					id: "user-2",
					roles: [],
				} as never,
				"unknown",
			),
		).rejects.toThrow(BadRequestError);
	});
});
