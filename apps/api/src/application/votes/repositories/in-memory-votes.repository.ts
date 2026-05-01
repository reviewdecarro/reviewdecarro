import { randomUUID } from "node:crypto";
import type { VoteType } from "../../../../prisma/generated/enums";
import { ReviewVoteEntity } from "../entities/review-vote.entity";
import { VotesRepositoryProps } from "./votes.repository";

export class InMemoryVotesRepository extends VotesRepositoryProps {
	public items: ReviewVoteEntity[] = [];

	async upsert(
		userId: string,
		reviewId: string,
		type: VoteType,
	): Promise<ReviewVoteEntity> {
		const existing = this.items.find(
			(vote) => vote.userId === userId && vote.reviewId === reviewId,
		);

		if (existing) {
			existing.type = type;
			return existing;
		}

		const vote = new ReviewVoteEntity({
			id: randomUUID(),
			userId,
			reviewId,
			type,
			createdAt: new Date(),
		});

		this.items.push(vote);

		return vote;
	}

	async delete(userId: string, reviewId: string): Promise<void> {
		this.items = this.items.filter(
			(vote) => !(vote.userId === userId && vote.reviewId === reviewId),
		);
	}
}
