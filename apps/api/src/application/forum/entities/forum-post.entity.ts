import { Expose } from "class-transformer";
import { ForumPostStatus } from "../../../../prisma/generated/enums";

export class ForumPostEntity {
	@Expose()
	id: string;

	@Expose()
	topicId: string;

	@Expose()
	authorId: string;

	@Expose()
	parentPostId: string | null;

	@Expose()
	content: string;

	@Expose()
	status: ForumPostStatus;

	@Expose()
	upvotes: number;

	@Expose()
	downvotes: number;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	deletedAt: Date | null;

	@Expose()
	author?: { id: string; username: string };

	@Expose()
	replies?: ForumPostEntity[];

	constructor({ replies, ...partial }: Partial<ForumPostEntity>) {
		Object.assign(this, partial);

		if (replies) {
			this.replies = replies.map((reply) => new ForumPostEntity(reply));
		}
	}
}
