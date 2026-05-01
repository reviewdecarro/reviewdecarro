import { CreateCommentDto } from "../dtos/create-comment.dto";
import { CommentEntity } from "../entities/comment.entity";

export abstract class CommentsRepositoryProps {
	abstract create(
		reviewId: string,
		userId: string,
		data: CreateCommentDto,
	): Promise<CommentEntity>;
	abstract findById(id: string): Promise<CommentEntity | null>;
	abstract findByReviewId(reviewId: string): Promise<CommentEntity[]>;
	abstract delete(id: string): Promise<void>;
}
