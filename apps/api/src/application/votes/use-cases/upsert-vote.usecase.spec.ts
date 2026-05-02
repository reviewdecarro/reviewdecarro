import { beforeEach, describe, expect, it } from "@jest/globals";
import { VoteType } from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ReviewEntity } from "../../reviews/entities/review.entity";
import { InMemoryReviewsRepository } from "../../reviews/repositories/in-memory-reviews.repository";
import { InMemoryVotesRepository } from "../repositories/in-memory-votes.repository";
import { UpsertVoteUseCase } from "./upsert-vote.usecase";

describe("UpsertVoteUseCase", () => {
	let votesRepository: InMemoryVotesRepository;
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: UpsertVoteUseCase;

	beforeEach(() => {
		votesRepository = new InMemoryVotesRepository();
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new UpsertVoteUseCase(votesRepository, reviewsRepository);
	});

	function seedReview() {
		reviewsRepository.items.push(
			new ReviewEntity({
				id: "review-1",
				userId: "author",
				carVersionId: "v1",
				commentsCount: 0,
				title: "t",
				content: "c",
				pros: null,
				cons: null,
				ownershipTimeMonths: null,
				kmDriven: null,
				score: 4,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);
	}

	it("should create a vote when none exists", async () => {
		seedReview();

		const result = await sut.execute("user-1", "review-1", {
			type: "UP" as VoteType,
		});

		expect(result).toHaveProperty("type", "UP");
		expect(votesRepository.items).toHaveLength(1);
	});

	it("should update an existing vote instead of duplicating", async () => {
		seedReview();

		await sut.execute("user-1", "review-1", { type: "UP" as VoteType });
		const result = await sut.execute("user-1", "review-1", {
			type: "DOWN" as VoteType,
		});

		expect(result).toHaveProperty("type", "DOWN");
		expect(votesRepository.items).toHaveLength(1);
		expect(votesRepository.items[0]?.type).toBe("DOWN");
	});

	it("should throw BadRequestError when review not found", async () => {
		await expect(
			sut.execute("user-1", "unknown", { type: "UP" as VoteType }),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute("user-1", "unknown", { type: "UP" as VoteType }),
		).rejects.toThrow("Review not found");
	});
});
