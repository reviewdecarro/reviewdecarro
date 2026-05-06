import {
	ForumVoteTargetType,
	ForumVoteValue,
} from "../../../../prisma/generated/enums";
import type { ForumVoteEntity } from "../entities/forum-vote.entity";

export abstract class ForumVotesRepositoryProps {
	abstract findByUserAndTarget(
		userId: string,
		targetId: string,
		targetType: ForumVoteTargetType,
	): Promise<ForumVoteEntity | null>;

	abstract create(
		userId: string,
		targetId: string,
		targetType: ForumVoteTargetType,
		value: ForumVoteValue,
	): Promise<ForumVoteEntity>;

	abstract update(id: string, value: ForumVoteValue): Promise<ForumVoteEntity>;
	abstract delete(id: string): Promise<void>;
}
