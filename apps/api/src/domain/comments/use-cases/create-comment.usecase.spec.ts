import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../../reviews/entities/review.entity";
import { InMemoryReviewsRepository } from "../../reviews/repositories/in-memory-reviews.repository";
import { InMemoryCommentsRepository } from "../repositories/in-memory-comments.repository";
import { CreateCommentUseCase } from "./create-comment.usecase";

describe("CreateCommentUseCase", () => {
	let commentsRepository: InMemoryCommentsRepository;
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: CreateCommentUseCase;

	beforeEach(() => {
		commentsRepository = new InMemoryCommentsRepository();
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new CreateCommentUseCase(commentsRepository, reviewsRepository);
	});

	function seedReview() {
		const review = new ReviewEntity({
			id: "review-1",
			userId: "author",
			carVersionId: "v1",
			title: "t",
			content: "c",
			pros: null,
			cons: null,
			ownershipTimeMonths: null,
			kmDriven: null,
			score: 4,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		reviewsRepository.items.push(review);
		return review;
	}

	it("should create a comment", async () => {
		const review = seedReview();

		const result = await sut.execute(review.id, "user-1", {
			content: "Concordo!",
		});

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("reviewId", review.id);
		expect(result).toHaveProperty("userId", "user-1");
		expect(result).toHaveProperty("content", "Concordo!");
		expect(commentsRepository.items).toHaveLength(1);
	});

	it("should throw BadRequestError when review not found", async () => {
		await expect(
			sut.execute("unknown", "user-1", { content: "x" }),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute("unknown", "user-1", { content: "x" }),
		).rejects.toThrow("Review not found");
	});
});
