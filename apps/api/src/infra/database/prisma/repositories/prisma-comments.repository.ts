import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "../../../../domain/comments/dtos/create-comment.dto";
import { CommentEntity } from "../../../../domain/comments/entities/comment.entity";
import { CommentsRepositoryProps } from "../../../../domain/comments/repositories/comments.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaCommentsRepository implements CommentsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(
		reviewId: string,
		userId: string,
		data: CreateCommentDto,
	): Promise<CommentEntity> {
		const comment = await this.prisma.comment.create({
			data: {
				reviewId,
				userId,
				content: data.content,
			},
		});

		return new CommentEntity(comment);
	}

	async findById(id: string): Promise<CommentEntity | null> {
		const comment = await this.prisma.comment.findUnique({
			where: { id },
		});

		if (!comment) return null;

		return new CommentEntity(comment);
	}

	async findByReviewId(reviewId: string): Promise<CommentEntity[]> {
		const comments = await this.prisma.comment.findMany({
			where: { reviewId },
			orderBy: { createdAt: "asc" },
		});

		return comments.map((comment) => new CommentEntity(comment));
	}

	async delete(id: string): Promise<void> {
		await this.prisma.comment.delete({ where: { id } });
	}
}
