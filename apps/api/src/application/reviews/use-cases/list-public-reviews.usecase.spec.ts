import { beforeEach, describe, expect, it } from "@jest/globals";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { ListPublicReviewsUseCase } from "./list-public-reviews.usecase";

function makeReview(id: string, score: number, day: number) {
	return new ReviewEntity({
		id,
		slug: `review-${id}`,
		title: `Review ${id}`,
		content: "Conteúdo",
		score,
		userId: "user-1",
		carVersionYearId: "cvy-1",
		pros: null,
		cons: null,
		ownershipTimeMonths: null,
		kmDriven: null,
		createdAt: new Date(2024, 0, day),
		updatedAt: new Date(2024, 0, day),
		commentsCount: 0,
	});
}

describe("ListPublicReviewsUseCase", () => {
	let repository: InMemoryReviewsRepository;
	let sut: ListPublicReviewsUseCase;

	beforeEach(() => {
		repository = new InMemoryReviewsRepository();
		sut = new ListPublicReviewsUseCase(repository);
	});

	it("returns null featured and empty list when there are no reviews", async () => {
		const result = await sut.execute({ page: 1, limit: 12 });

		expect(result.featured).toBeNull();
		expect(result.items).toEqual([]);
		expect(result.meta).toEqual({ page: 1, limit: 12, total: 0, totalPages: 0 });
	});

	it("pins the top-scored review and excludes it from the list", async () => {
		repository.items.push(
			makeReview("low", 3, 1),
			makeReview("top", 9, 2),
			makeReview("mid", 5, 3),
		);

		const result = await sut.execute({ page: 1, limit: 12 });

		expect(result.featured?.id).toBe("top");
		expect(result.items.map((r) => r.id)).toEqual(["mid", "low"]);
		expect(result.meta).toEqual({ page: 1, limit: 12, total: 2, totalPages: 1 });
	});

	it("paginates the non-featured reviews", async () => {
		repository.items.push(makeReview("top", 9, 10));
		for (let i = 0; i < 5; i++) {
			repository.items.push(makeReview(`r${i}`, 1, i + 1));
		}

		const result = await sut.execute({ page: 2, limit: 2 });

		expect(result.featured?.id).toBe("top");
		expect(result.items).toHaveLength(2);
		expect(result.meta).toEqual({ page: 2, limit: 2, total: 5, totalPages: 3 });
	});
});
