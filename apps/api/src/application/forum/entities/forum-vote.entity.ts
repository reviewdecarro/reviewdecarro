import { Expose } from "class-transformer";
import {
	ForumVoteTargetType,
	ForumVoteValue,
} from "../../../../prisma/generated/enums";

export class ForumVoteEntity {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	targetId: string;

	@Expose()
	targetType: ForumVoteTargetType;

	@Expose()
	value: ForumVoteValue;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	constructor(partial: Partial<ForumVoteEntity>) {
		Object.assign(this, partial);
	}
}
