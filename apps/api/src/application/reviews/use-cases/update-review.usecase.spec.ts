import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { UpdateReviewUseCase } from "./update-review.usecase";

describe("UpdateReviewUseCase", () => {
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: UpdateReviewUseCase;

	beforeEach(() => {
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new UpdateReviewUseCase(reviewsRepository);
	});

	function makeReview(overrides: Partial<ReviewEntity> = {}): ReviewEntity {
		return new ReviewEntity({
			id: overrides.id ?? "review-1",
			userId: overrides.userId ?? "user-1",
			carVersionId: overrides.carVersionId ?? "v1",
			title: overrides.title ?? "Old title",
			content: overrides.content ?? "Old content",
			pros: null,
			cons: null,
			ownershipTimeMonths: null,
			kmDriven: null,
			score: 4,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	it("should update the review", async () => {
		reviewsRepository.items.push(makeReview({ userId: "user-1" }));

		const result = await sut.execute("user-1", "review-1", {
			title: "New title",
		});

		expect(result).toHaveProperty("title", "New title");

		const stored = reviewsRepository.items.find((r) => r.id === "review-1");
		expect(stored?.title).toBe("New title");
	});

	it("should throw BadRequestError when review not found", async () => {
		await expect(
			sut.execute("user-1", "unknown", { title: "x" }),
		).rejects.toThrow("Review not found");
	});

	it("should throw BadRequestError when user is not the owner", async () => {
		reviewsRepository.items.push(makeReview({ userId: "owner" }));

		await expect(
			sut.execute("stranger", "review-1", { title: "x" }),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute("stranger", "review-1", { title: "x" }),
		).rejects.toThrow("You can only edit your own reviews");
	});
});
