import type { CreateForumPostDto } from "../dtos/create-forum-post.dto";
import type { ForumPostEntity } from "../entities/forum-post.entity";

export abstract class ForumPostsRepositoryProps {
	abstract create(
		topicId: string,
		authorId: string,
		data: CreateForumPostDto,
	): Promise<ForumPostEntity>;

	abstract findById(id: string): Promise<ForumPostEntity | null>;
	abstract findByTopicId(topicId: string): Promise<ForumPostEntity[]>;
	abstract incrementUpvotes(postId: string): Promise<void>;
	abstract decrementUpvotes(postId: string): Promise<void>;
	abstract incrementDownvotes(postId: string): Promise<void>;
	abstract decrementDownvotes(postId: string): Promise<void>;
	abstract delete(id: string): Promise<void>;
}
