import { Injectable } from "@nestjs/common";
import { VoteType } from "../../../../../prisma/generated/enums";
import { ReviewVoteEntity } from "../../../../domain/votes/entities/review-vote.entity";
import { VotesRepositoryProps } from "../../../../domain/votes/repositories/votes.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaVotesRepository implements VotesRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async upsert(
		userId: string,
		reviewId: string,
		type: VoteType,
	): Promise<ReviewVoteEntity> {
		const vote = await this.prisma.reviewVote.upsert({
			where: { userId_reviewId: { userId, reviewId } },
			create: { userId, reviewId, type },
			update: { type },
		});

		return new ReviewVoteEntity(vote);
	}

	async delete(userId: string, reviewId: string): Promise<void> {
		await this.prisma.reviewVote.deleteMany({
			where: { userId, reviewId },
		});
	}
}
