import type { CreateForumTopicDto } from "../dtos/create-forum-topic.dto";
import type { ForumTopicEntity } from "../entities/forum-topic.entity";

export type AdminForumTopicsListParams = {
	query?: string;
	page: number;
	limit: number;
};

export type AdminForumTopicsListResult = {
	topics: ForumTopicEntity[];
	total: number;
};

export abstract class ForumTopicsRepositoryProps {
	abstract create(
		authorId: string,
		data: CreateForumTopicDto & { slug: string },
	): Promise<ForumTopicEntity>;

	abstract findAll(filters?: { query?: string }): Promise<ForumTopicEntity[]>;
	abstract findById(id: string): Promise<ForumTopicEntity | null>;
	abstract findBySlug(slug: string): Promise<ForumTopicEntity | null>;
	abstract countPublished(): Promise<number>;
	abstract countByAuthorId(authorId: string): Promise<number>;
	abstract findManyForAdmin(
		params: AdminForumTopicsListParams,
	): Promise<AdminForumTopicsListResult>;
	abstract findByIdForAdmin(id: string): Promise<ForumTopicEntity | null>;
	abstract incrementPostsCount(topicId: string): Promise<void>;
	abstract incrementUpvotes(topicId: string): Promise<void>;
	abstract decrementUpvotes(topicId: string): Promise<void>;
	abstract incrementDownvotes(topicId: string): Promise<void>;
	abstract decrementDownvotes(topicId: string): Promise<void>;
	abstract delete(id: string): Promise<void>;
}
