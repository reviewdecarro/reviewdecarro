import { randomUUID } from "node:crypto";
import { ForumTopicStatus } from "../../../../prisma/generated/enums";
import type { CreateForumTopicDto } from "../dtos/create-forum-topic.dto";
import { ForumTopicEntity } from "../entities/forum-topic.entity";
import { ForumTopicsRepositoryProps } from "./forum-topics.repository";

export class InMemoryForumTopicsRepository extends ForumTopicsRepositoryProps {
	public items: ForumTopicEntity[] = [];

	async create(
		authorId: string,
		data: CreateForumTopicDto & { slug: string },
	): Promise<ForumTopicEntity> {
		const now = new Date();
		const topic = new ForumTopicEntity({
			id: randomUUID(),
			authorId,
			title: data.title,
			slug: data.slug,
			content: data.content,
			status: ForumTopicStatus.PUBLISHED,
			viewsCount: 0,
			postsCount: 0,
			upvotes: 0,
			downvotes: 0,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		});

		this.items.push(topic);

		return topic;
	}

	async findAll(): Promise<ForumTopicEntity[]> {
		return this.items
			.filter((topic) => topic.status === ForumTopicStatus.PUBLISHED)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	}

	async findById(id: string): Promise<ForumTopicEntity | null> {
		return this.items.find((topic) => topic.id === id) ?? null;
	}

	async findBySlug(slug: string): Promise<ForumTopicEntity | null> {
		return this.items.find((topic) => topic.slug === slug) ?? null;
	}

	async incrementViewsCount(topicId: string): Promise<void> {
		const topic = this.items.find((item) => item.id === topicId);

		if (topic) {
			topic.viewsCount += 1;
		}
	}

	async incrementPostsCount(topicId: string): Promise<void> {
		const topic = this.items.find((item) => item.id === topicId);

		if (topic) {
			topic.postsCount += 1;
		}
	}

	async incrementUpvotes(topicId: string): Promise<void> {
		const topic = this.items.find((item) => item.id === topicId);

		if (topic) {
			topic.upvotes += 1;
		}
	}

	async decrementUpvotes(topicId: string): Promise<void> {
		const topic = this.items.find((item) => item.id === topicId);

		if (topic) {
			topic.upvotes = Math.max(topic.upvotes - 1, 0);
		}
	}

	async incrementDownvotes(topicId: string): Promise<void> {
		const topic = this.items.find((item) => item.id === topicId);

		if (topic) {
			topic.downvotes += 1;
		}
	}

	async decrementDownvotes(topicId: string): Promise<void> {
		const topic = this.items.find((item) => item.id === topicId);

		if (topic) {
			topic.downvotes = Math.max(topic.downvotes - 1, 0);
		}
	}

	async delete(id: string): Promise<void> {
		const topic = this.items.find((item) => item.id === id);

		if (topic) {
			topic.status = ForumTopicStatus.DELETED;
			topic.deletedAt = new Date();
		}
	}
}
