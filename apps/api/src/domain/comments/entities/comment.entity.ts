import { Expose } from "class-transformer";
import { CommentModel } from "../../../../prisma/generated/models/Comment";

export class CommentEntity implements CommentModel {
	@Expose()
	id: string;

	@Expose()
	reviewId: string;

	@Expose()
	userId: string;

	@Expose()
	content: string;

	@Expose()
	createdAt: Date;

	constructor(partial: Partial<CommentEntity>) {
		Object.assign(this, partial);
	}
}
