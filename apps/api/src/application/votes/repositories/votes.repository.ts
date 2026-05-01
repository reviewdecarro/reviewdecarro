import { VoteType } from "../../../../prisma/generated/enums";
import { ReviewVoteEntity } from "../entities/review-vote.entity";

export abstract class VotesRepositoryProps {
	abstract upsert(
		userId: string,
		reviewId: string,
		type: VoteType,
	): Promise<ReviewVoteEntity>;
	abstract delete(userId: string, reviewId: string): Promise<void>;
}
