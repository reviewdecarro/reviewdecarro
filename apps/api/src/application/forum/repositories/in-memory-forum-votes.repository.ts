import { randomUUID } from "node:crypto";
import {
	ForumVoteTargetType,
	ForumVoteValue,
} from "../../../../prisma/generated/enums";
import { ForumVoteEntity } from "../entities/forum-vote.entity";
import { ForumVotesRepositoryProps } from "./forum-votes.repository";

export class InMemoryForumVotesRepository extends ForumVotesRepositoryProps {
	public items: ForumVoteEntity[] = [];

	async findByUserAndTarget(
		userId: string,
		targetId: string,
		targetType: ForumVoteTargetType,
	): Promise<ForumVoteEntity | null> {
		return (
			this.items.find(
				(vote) =>
					vote.userId === userId &&
					vote.targetId === targetId &&
					vote.targetType === targetType,
			) ?? null
		);
	}

	async create(
		userId: string,
		targetId: string,
		targetType: ForumVoteTargetType,
		value: ForumVoteValue,
	): Promise<ForumVoteEntity> {
		const now = new Date();
		const vote = new ForumVoteEntity({
			id: randomUUID(),
			userId,
			targetId,
			targetType,
			value,
			createdAt: now,
			updatedAt: now,
		});

		this.items.push(vote);

		return vote;
	}

	async update(id: string, value: ForumVoteValue): Promise<ForumVoteEntity> {
		const vote = this.items.find((item) => item.id === id);

		if (!vote) {
			throw new Error(`Forum vote with id ${id} not found`);
		}

		vote.value = value;
		vote.updatedAt = new Date();

		return vote;
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((vote) => vote.id !== id);
	}
}
