import { Injectable } from "@nestjs/common";
import { ForumPostStatus } from "../../../../../prisma/generated/enums";
import type { CreateForumPostDto } from "../../../../application/forum/dtos/create-forum-post.dto";
import { ForumPostEntity } from "../../../../application/forum/entities/forum-post.entity";
import { ForumPostsRepositoryProps } from "../../../../application/forum/repositories/forum-posts.repository";
import { PrismaService } from "../prisma.service";

const forumPostInclude = {
	author: {
		select: {
			id: true,
			username: true,
		},
	},
} as const;

@Injectable()
export class PrismaForumPostsRepository extends ForumPostsRepositoryProps {
	constructor(private prisma: PrismaService) {
		super();
	}

	async create(
		topicId: string,
		authorId: string,
		data: CreateForumPostDto,
	): Promise<ForumPostEntity> {
		const post = await this.prisma.forumPost.create({
			data: {
				topicId,
				authorId,
				parentPostId: data.parentPostId ?? null,
				content: data.content,
				status: ForumPostStatus.PUBLISHED,
			},
			include: forumPostInclude,
		});

		return new ForumPostEntity(post);
	}

	async findById(id: string): Promise<ForumPostEntity | null> {
		const post = await this.prisma.forumPost.findUnique({
			where: { id },
			include: forumPostInclude,
		});

		if (!post) {
			return null;
		}

		return new ForumPostEntity(post);
	}

	async findByTopicId(topicId: string): Promise<ForumPostEntity[]> {
		const posts = await this.prisma.forumPost.findMany({
			where: {
				topicId,
				status: ForumPostStatus.PUBLISHED,
				deletedAt: null,
			},
			include: forumPostInclude,
			orderBy: { createdAt: "asc" },
		});

		return posts.map((post) => new ForumPostEntity(post));
	}

	async incrementUpvotes(postId: string): Promise<void> {
		await this.prisma.forumPost.update({
			where: { id: postId },
			data: {
				upvotes: {
					increment: 1,
				},
			},
		});
	}

	async decrementUpvotes(postId: string): Promise<void> {
		await this.prisma.forumPost.update({
			where: { id: postId },
			data: {
				upvotes: {
					decrement: 1,
				},
			},
		});
	}

	async incrementDownvotes(postId: string): Promise<void> {
		await this.prisma.forumPost.update({
			where: { id: postId },
			data: {
				downvotes: {
					increment: 1,
				},
			},
		});
	}

	async decrementDownvotes(postId: string): Promise<void> {
		await this.prisma.forumPost.update({
			where: { id: postId },
			data: {
				downvotes: {
					decrement: 1,
				},
			},
		});
	}

	async delete(id: string): Promise<void> {
		await this.prisma.forumPost.update({
			where: { id },
			data: {
				status: ForumPostStatus.DELETED,
				deletedAt: new Date(),
			},
		});
	}
}
