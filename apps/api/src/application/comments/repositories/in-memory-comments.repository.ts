import { randomUUID } from "node:crypto";
import type { CreateCommentDto } from "../dtos/create-comment.dto";
import { CommentEntity } from "../entities/comment.entity";
import { CommentsRepositoryProps } from "./comments.repository";

export class InMemoryCommentsRepository extends CommentsRepositoryProps {
	public items: CommentEntity[] = [];

	async create(
		reviewId: string,
		userId: string,
		data: CreateCommentDto,
	): Promise<CommentEntity> {
		const comment = new CommentEntity({
			id: randomUUID(),
			reviewId,
			userId,
			content: data.content,
			createdAt: new Date(),
		});

		this.items.push(comment);

		return comment;
	}

	async findById(id: string): Promise<CommentEntity | null> {
		return this.items.find((comment) => comment.id === id) ?? null;
	}

	async findByReviewId(reviewId: string): Promise<CommentEntity[]> {
		return this.items.filter((comment) => comment.reviewId === reviewId);
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((comment) => comment.id !== id);
	}
}
