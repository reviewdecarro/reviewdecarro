import { Expose } from "class-transformer";
import { VoteType } from "../../../../prisma/generated/enums";
import { ReviewVoteModel } from "../../../../prisma/generated/models/ReviewVote";

export class ReviewVoteEntity implements ReviewVoteModel {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	reviewId: string;

	@Expose()
	type: VoteType;

	@Expose()
	createdAt: Date;

	constructor(partial: Partial<ReviewVoteEntity>) {
		Object.assign(this, partial);
	}
}
