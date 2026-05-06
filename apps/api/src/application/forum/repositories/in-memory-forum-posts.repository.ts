import { randomUUID } from "node:crypto";
import { ForumPostStatus } from "../../../../prisma/generated/enums";
import type { CreateForumPostDto } from "../dtos/create-forum-post.dto";
import { ForumPostEntity } from "../entities/forum-post.entity";
import { ForumPostsRepositoryProps } from "./forum-posts.repository";

export class InMemoryForumPostsRepository extends ForumPostsRepositoryProps {
	public items: ForumPostEntity[] = [];

	async create(
		topicId: string,
		authorId: string,
		data: CreateForumPostDto,
	): Promise<ForumPostEntity> {
		const now = new Date();
		const post = new ForumPostEntity({
			id: randomUUID(),
			topicId,
			authorId,
			parentPostId: data.parentPostId ?? null,
			content: data.content,
			status: ForumPostStatus.PUBLISHED,
			upvotes: 0,
			downvotes: 0,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		});

		this.items.push(post);

		return post;
	}

	async findById(id: string): Promise<ForumPostEntity | null> {
		return this.items.find((post) => post.id === id) ?? null;
	}

	async findByTopicId(topicId: string): Promise<ForumPostEntity[]> {
		return this.items
			.filter(
				(post) => post.topicId === topicId && post.status === ForumPostStatus.PUBLISHED,
			)
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	}

	async incrementUpvotes(postId: string): Promise<void> {
		const post = this.items.find((item) => item.id === postId);

		if (post) {
			post.upvotes += 1;
		}
	}

	async decrementUpvotes(postId: string): Promise<void> {
		const post = this.items.find((item) => item.id === postId);

		if (post) {
			post.upvotes = Math.max(post.upvotes - 1, 0);
		}
	}

	async incrementDownvotes(postId: string): Promise<void> {
		const post = this.items.find((item) => item.id === postId);

		if (post) {
			post.downvotes += 1;
		}
	}

	async decrementDownvotes(postId: string): Promise<void> {
		const post = this.items.find((item) => item.id === postId);

		if (post) {
			post.downvotes = Math.max(post.downvotes - 1, 0);
		}
	}

	async delete(id: string): Promise<void> {
		const post = this.items.find((item) => item.id === id);

		if (post) {
			post.status = ForumPostStatus.DELETED;
			post.deletedAt = new Date();
		}
	}
}
