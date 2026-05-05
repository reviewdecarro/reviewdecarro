import { beforeEach, describe, expect, it } from "@jest/globals";
import { VoteType } from "../../../../prisma/generated/enums";
import { ReviewVoteEntity } from "../entities/review-vote.entity";
import { InMemoryVotesRepository } from "../repositories/in-memory-votes.repository";
import { DeleteVoteUseCase } from "./delete-vote.usecase";

describe("DeleteVoteUseCase", () => {
	let votesRepository: InMemoryVotesRepository;
	let sut: DeleteVoteUseCase;

	beforeEach(() => {
		votesRepository = new InMemoryVotesRepository();
		sut = new DeleteVoteUseCase(votesRepository);
	});

	it("should remove the vote for the user/review pair", async () => {
		votesRepository.items.push(
			new ReviewVoteEntity({
				id: "v1",
				userId: "user-1",
				reviewId: "review-1",
				type: "UP" as VoteType,
				createdAt: new Date(),
			}),
			new ReviewVoteEntity({
				id: "v2",
				userId: "user-2",
				reviewId: "review-1",
				type: "UP" as VoteType,
				createdAt: new Date(),
			}),
		);

		await sut.execute("user-1", "review-1");

		expect(votesRepository.items).toHaveLength(1);
		expect(votesRepository.items[0]?.userId).toBe("user-2");
	});

	it("should be a no-op when no matching vote exists", async () => {
		await expect(sut.execute("user-1", "review-1")).resolves.toBeUndefined();
	});
});
