import { beforeEach, describe, expect, it } from "@jest/globals";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { ListReviewsUseCase } from "./list-reviews.usecase";

describe("ListReviewsUseCase", () => {
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: ListReviewsUseCase;

	beforeEach(() => {
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new ListReviewsUseCase(reviewsRepository);
	});

	function makeReview(overrides: Partial<ReviewEntity> = {}): ReviewEntity {
		return new ReviewEntity({
			id: overrides.id ?? "r1",
			userId: overrides.userId ?? "user-1",
			user: overrides.user,
			carVersionYearId: overrides.carVersionYearId ?? "year-1",
			title: overrides.title ?? "Title",
			content: overrides.content ?? "Content",
			pros: null,
			cons: null,
			ownershipTimeMonths: null,
			kmDriven: null,
			score: 4,
			createdAt: overrides.createdAt ?? new Date(),
			updatedAt: new Date(),
		});
	}

	it("should return all reviews when no filters given", async () => {
		reviewsRepository.items.push(
			makeReview({ id: "a" }),
			makeReview({ id: "b" }),
		);

		const result = await sut.execute();

		expect(result).toHaveLength(2);
	});

	it("should filter by carVersionYearId", async () => {
		reviewsRepository.items.push(
			makeReview({ id: "a", carVersionYearId: "year-1" }),
			makeReview({ id: "b", carVersionYearId: "year-2" }),
		);

		const result = await sut.execute({ carVersionYearId: "year-2" });

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("id", "b");
	});

	it("should filter by username", async () => {
		reviewsRepository.items.push(
			makeReview({
				id: "a",
				userId: "u1",
				user: { id: "u1", username: "alice" },
			}),
			makeReview({
				id: "b",
				userId: "u2",
				user: { id: "u2", username: "bob" },
			}),
		);

		const result = await sut.execute({ username: "alice" });

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("userId", "u1");
	});

	it("should filter by query (case-insensitive, title or content)", async () => {
		reviewsRepository.items.push(
			makeReview({ id: "a", title: "Great car", content: "x" }),
			makeReview({ id: "b", title: "x", content: "Horrible experience" }),
			makeReview({ id: "c", title: "x", content: "x" }),
		);

		const result = await sut.execute({ query: "great" });

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("id", "a");
	});
});
