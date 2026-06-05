import { Expose } from "class-transformer";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import { ForumPostEntity } from "./forum-post.entity";

export class ForumTopicEntity {
	@Expose()
	id: string;

	@Expose()
	authorId: string;

	@Expose()
	title: string;

	@Expose()
	slug: string;

	@Expose()
	content: string;

	@Expose()
	status: ForumTopicStatus;

	@Expose()
	postsCount: number;

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
	posts?: ForumPostEntity[];

	constructor({ posts, ...partial }: Partial<ForumTopicEntity>) {
		Object.assign(this, partial);

		if (posts) {
			this.posts = posts.map((post) => new ForumPostEntity(post));
		}
	}
}
