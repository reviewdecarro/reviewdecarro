import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { GetReviewBySlugUseCase } from "./get-review-by-slug.usecase";

describe("GetReviewBySlugUseCase", () => {
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: GetReviewBySlugUseCase;

	beforeEach(() => {
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new GetReviewBySlugUseCase(reviewsRepository);
	});

	it("should return a review by slug", async () => {
		reviewsRepository.items.push(
			new ReviewEntity({
				id: "review-1",
				userId: "user-1",
				carVersionId: "v1",
				title: "Ótimo carro",
				slug: "otimo-carro",
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

		const result = await sut.execute("otimo-carro");

		expect(result).toHaveProperty("id", "review-1");
		expect(result).toHaveProperty("slug", "otimo-carro");
	});

	it("should throw BadRequestError when slug not found", async () => {
		await expect(sut.execute("missing")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("missing")).rejects.toThrow("Review not found");
	});
});
