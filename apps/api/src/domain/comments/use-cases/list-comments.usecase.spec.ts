import { beforeEach, describe, expect, it } from "@jest/globals";
import { CommentEntity } from "../entities/comment.entity";
import { InMemoryCommentsRepository } from "../repositories/in-memory-comments.repository";
import { ListCommentsUseCase } from "./list-comments.usecase";

describe("ListCommentsUseCase", () => {
	let commentsRepository: InMemoryCommentsRepository;
	let sut: ListCommentsUseCase;

	beforeEach(() => {
		commentsRepository = new InMemoryCommentsRepository();
		sut = new ListCommentsUseCase(commentsRepository);
	});

	it("should return only comments for the given review", async () => {
		commentsRepository.items.push(
			new CommentEntity({
				id: "c1",
				reviewId: "r1",
				userId: "u1",
				content: "Yes",
				createdAt: new Date(),
			}),
			new CommentEntity({
				id: "c2",
				reviewId: "r2",
				userId: "u1",
				content: "No",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute("r1");

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("id", "c1");
	});

	it("should return empty list when no comments exist for review", async () => {
		const result = await sut.execute("r1");

		expect(result).toEqual([]);
	});
});
