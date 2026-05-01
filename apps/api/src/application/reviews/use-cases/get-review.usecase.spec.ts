import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { GetReviewUseCase } from "./get-review.usecase";

describe("GetReviewUseCase", () => {
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: GetReviewUseCase;

	beforeEach(() => {
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new GetReviewUseCase(reviewsRepository);
	});

	it("should return a review by id", async () => {
		reviewsRepository.items.push(
			new ReviewEntity({
				id: "review-1",
				userId: "user-1",
				carVersionId: "v1",
				title: "Ótimo",
				slug: "otimo",
				content: "Conteúdo",
				pros: null,
				cons: null,
				ownershipTimeMonths: null,
				kmDriven: null,
				score: 4.5,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);

		const result = await sut.execute("review-1");

		expect(result).toHaveProperty("id", "review-1");
		expect(result).toHaveProperty("title", "Ótimo");
	});

	it("should throw BadRequestError when review not found", async () => {
		await expect(sut.execute("unknown")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("unknown")).rejects.toThrow("Review not found");
	});
});
