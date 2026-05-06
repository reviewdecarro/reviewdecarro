import { Injectable } from "@nestjs/common";
import {
	ForumVoteTargetType,
	ForumVoteValue,
} from "../../../../../prisma/generated/enums";
import { ForumVoteEntity } from "../../../../application/forum/entities/forum-vote.entity";
import { ForumVotesRepositoryProps } from "../../../../application/forum/repositories/forum-votes.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaForumVotesRepository extends ForumVotesRepositoryProps {
	constructor(private prisma: PrismaService) {
		super();
	}

	async findByUserAndTarget(
		userId: string,
		targetId: string,
		targetType: ForumVoteTargetType,
	): Promise<ForumVoteEntity | null> {
		const vote = await this.prisma.forumVote.findUnique({
			where: {
				userId_targetId_targetType: {
					userId,
					targetId,
					targetType,
				},
			},
		});

		if (!vote) {
			return null;
		}

		return new ForumVoteEntity(vote);
	}

	async create(
		userId: string,
		targetId: string,
		targetType: ForumVoteTargetType,
		value: ForumVoteValue,
	): Promise<ForumVoteEntity> {
		const vote = await this.prisma.forumVote.create({
			data: {
				userId,
				targetId,
				targetType,
				value,
			},
		});

		return new ForumVoteEntity(vote);
	}

	async update(id: string, value: ForumVoteValue): Promise<ForumVoteEntity> {
		const vote = await this.prisma.forumVote.update({
			where: { id },
			data: {
				value,
			},
		});

		return new ForumVoteEntity(vote);
	}

	async delete(id: string): Promise<void> {
		await this.prisma.forumVote.delete({
			where: { id },
		});
	}
}
