import { Injectable } from "@nestjs/common";
import {
	ForumVoteTargetType,
	ForumVoteValue,
} from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumVoteEntity } from "../entities/forum-vote.entity";
import { ForumPostsRepositoryProps } from "../repositories/forum-posts.repository";
import { ForumTopicsRepositoryProps } from "../repositories/forum-topics.repository";
import { ForumVotesRepositoryProps } from "../repositories/forum-votes.repository";

type ForumVoteResult = {
	action: "created" | "updated" | "removed";
	vote: ForumVoteEntity | null;
};

@Injectable()
export class UpsertForumVoteUseCase {
	constructor(
		private forumVotesRepository: ForumVotesRepositoryProps,
		private forumTopicsRepository: ForumTopicsRepositoryProps,
		private forumPostsRepository: ForumPostsRepositoryProps,
	) {}

	async execute(
		userId: string,
		targetType: ForumVoteTargetType,
		targetId: string,
		value: ForumVoteValue,
	): Promise<ForumVoteResult> {
		const target = await this.findTarget(targetType, targetId);

		if (!target) {
			throw new BadRequestError("Forum target not found");
		}

		const existing = await this.forumVotesRepository.findByUserAndTarget(
			userId,
			targetId,
			targetType,
		);

		if (!existing) {
			const vote = await this.forumVotesRepository.create(
				userId,
				targetId,
				targetType,
				value,
			);

			await this.applyVoteDelta(targetType, targetId, value, 1);

			return {
				action: "created",
				vote,
			};
		}

		if (existing.value === value) {
			await this.forumVotesRepository.delete(existing.id);
			await this.applyVoteDelta(targetType, targetId, value, -1);

			return {
				action: "removed",
				vote: null,
			};
		}

		const previousValue = existing.value;
		const updated = await this.forumVotesRepository.update(existing.id, value);
		await this.applyVoteDelta(targetType, targetId, previousValue, -1);
		await this.applyVoteDelta(targetType, targetId, value, 1);

		return {
			action: "updated",
			vote: updated,
		};
	}

	private async findTarget(
		targetType: ForumVoteTargetType,
		targetId: string,
	): Promise<ForumTopicEntity | ForumPostEntity | null> {
		if (targetType === ForumVoteTargetType.TOPIC) {
			const topic = await this.forumTopicsRepository.findById(targetId);

			if (!topic || topic.deletedAt) {
				return null;
			}

			return topic;
		}

		const post = await this.forumPostsRepository.findById(targetId);

		if (!post || post.deletedAt) {
			return null;
		}

		return post;
	}

	private async applyVoteDelta(
		targetType: ForumVoteTargetType,
		targetId: string,
		value: ForumVoteValue,
		delta: 1 | -1,
	): Promise<void> {
		const isUp = value === ForumVoteValue.UP;

		if (targetType === ForumVoteTargetType.TOPIC) {
			if (isUp) {
				if (delta === 1) {
					await this.forumTopicsRepository.incrementUpvotes(targetId);
				} else {
					await this.forumTopicsRepository.decrementUpvotes(targetId);
				}
			} else if (delta === 1) {
				await this.forumTopicsRepository.incrementDownvotes(targetId);
			} else {
				await this.forumTopicsRepository.decrementDownvotes(targetId);
			}

			return;
		}

		if (isUp) {
			if (delta === 1) {
				await this.forumPostsRepository.incrementUpvotes(targetId);
			} else {
				await this.forumPostsRepository.decrementUpvotes(targetId);
			}
		} else if (delta === 1) {
			await this.forumPostsRepository.incrementDownvotes(targetId);
		} else {
			await this.forumPostsRepository.decrementDownvotes(targetId);
		}
	}
}
