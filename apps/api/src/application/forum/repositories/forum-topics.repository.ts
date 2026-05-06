import type { CreateForumTopicDto } from "../dtos/create-forum-topic.dto";
import type { ForumTopicEntity } from "../entities/forum-topic.entity";

export abstract class ForumTopicsRepositoryProps {
	abstract create(
		authorId: string,
		data: CreateForumTopicDto & { slug: string },
	): Promise<ForumTopicEntity>;

	abstract findAll(): Promise<ForumTopicEntity[]>;
	abstract findById(id: string): Promise<ForumTopicEntity | null>;
	abstract findBySlug(slug: string): Promise<ForumTopicEntity | null>;
	abstract incrementViewsCount(topicId: string): Promise<void>;
	abstract incrementPostsCount(topicId: string): Promise<void>;
	abstract incrementUpvotes(topicId: string): Promise<void>;
	abstract decrementUpvotes(topicId: string): Promise<void>;
	abstract incrementDownvotes(topicId: string): Promise<void>;
	abstract decrementDownvotes(topicId: string): Promise<void>;
	abstract delete(id: string): Promise<void>;
}
