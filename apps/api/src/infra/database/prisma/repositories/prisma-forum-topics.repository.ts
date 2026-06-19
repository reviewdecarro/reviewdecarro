import { Injectable } from "@nestjs/common";
import { ForumTopicStatus } from "../../../../../prisma/generated/enums";
import type { CreateForumTopicDto } from "../../../../application/forum/dtos/create-forum-topic.dto";
import { ForumTopicEntity } from "../../../../application/forum/entities/forum-topic.entity";
import {
	type AdminForumTopicsListParams,
	type AdminForumTopicsListResult,
	ForumTopicsRepositoryProps,
} from "../../../../application/forum/repositories/forum-topics.repository";
import { PrismaService } from "../prisma.service";

const forumTopicInclude = {
	author: {
		select: {
			id: true,
			username: true,
		},
	},
} as const;

@Injectable()
export class PrismaForumTopicsRepository extends ForumTopicsRepositoryProps {
	constructor(private prisma: PrismaService) {
		super();
	}

	async create(
		authorId: string,
		data: CreateForumTopicDto & { slug: string },
	): Promise<ForumTopicEntity> {
		const topic = await this.prisma.forumTopic.create({
			data: {
				authorId,
				title: data.title,
				slug: data.slug,
				content: data.content,
				status: ForumTopicStatus.PUBLISHED,
			},
			include: forumTopicInclude,
		});

		return new ForumTopicEntity(topic);
	}

	async findAll(filters?: { query?: string }): Promise<ForumTopicEntity[]> {
		const topics = await this.prisma.forumTopic.findMany({
			where: {
				status: ForumTopicStatus.PUBLISHED,
				deletedAt: null,
				...(filters?.query
					? {
							OR: [
								{
									title: {
										contains: filters.query,
										mode: "insensitive" as const,
									},
								},
				{
					content: {
						contains: filters.query,
						mode: "insensitive" as const,
					},
				},
				{
					author: {
						username: {
							contains: filters.query,
							mode: "insensitive" as const,
						},
					},
				},
			],
		}
					: {}),
			},
			include: forumTopicInclude,
			orderBy: { createdAt: "desc" },
		});

		return topics.map((topic) => new ForumTopicEntity(topic));
	}

	async findById(id: string): Promise<ForumTopicEntity | null> {
		const topic = await this.prisma.forumTopic.findUnique({
			where: { id },
			include: forumTopicInclude,
		});

		if (!topic) {
			return null;
		}

		return new ForumTopicEntity(topic);
	}

	async findBySlug(slug: string): Promise<ForumTopicEntity | null> {
		const topic = await this.prisma.forumTopic.findUnique({
			where: {
				slug,
			},
			include: forumTopicInclude,
		});

		if (!topic) {
			return null;
		}

		return new ForumTopicEntity(topic);
	}

	async countPublished(): Promise<number> {
		return this.prisma.forumTopic.count({
			where: {
				status: ForumTopicStatus.PUBLISHED,
				deletedAt: null,
			},
		});
	}

	async countByAuthorId(authorId: string): Promise<number> {
		return this.prisma.forumTopic.count({ where: { authorId } });
	}

	async findManyForAdmin(
		params: AdminForumTopicsListParams,
	): Promise<AdminForumTopicsListResult> {
		const query = params.query?.trim();
		const where = {
			status: ForumTopicStatus.PUBLISHED,
			deletedAt: null,
			...(query
				? {
						OR: [
							{
								title: {
									contains: query,
									mode: "insensitive" as const,
								},
							},
							{
								content: {
									contains: query,
									mode: "insensitive" as const,
								},
							},
							{
								author: {
									username: {
										contains: query,
										mode: "insensitive" as const,
									},
								},
							},
						],
					}
				: {}),
		};

		const [topics, total] = await this.prisma.$transaction([
			this.prisma.forumTopic.findMany({
				where,
				include: forumTopicInclude,
				orderBy: { createdAt: "desc" },
				skip: (params.page - 1) * params.limit,
				take: params.limit,
			}),
			this.prisma.forumTopic.count({ where }),
		]);

		return {
			topics: topics.map((topic) => new ForumTopicEntity(topic)),
			total,
		};
	}

	async findByIdForAdmin(id: string): Promise<ForumTopicEntity | null> {
		const topic = await this.prisma.forumTopic.findFirst({
			where: {
				id,
				status: ForumTopicStatus.PUBLISHED,
				deletedAt: null,
			},
			include: forumTopicInclude,
		});

		if (!topic) {
			return null;
		}

		return new ForumTopicEntity(topic);
	}

	async incrementPostsCount(topicId: string): Promise<void> {
		await this.prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				postsCount: {
					increment: 1,
				},
			},
		});
	}

	async incrementUpvotes(topicId: string): Promise<void> {
		await this.prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				upvotes: {
					increment: 1,
				},
			},
		});
	}

	async decrementUpvotes(topicId: string): Promise<void> {
		await this.prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				upvotes: {
					decrement: 1,
				},
			},
		});
	}

	async incrementDownvotes(topicId: string): Promise<void> {
		await this.prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				downvotes: {
					increment: 1,
				},
			},
		});
	}

	async decrementDownvotes(topicId: string): Promise<void> {
		await this.prisma.forumTopic.update({
			where: { id: topicId },
			data: {
				downvotes: {
					decrement: 1,
				},
			},
		});
	}

	async delete(id: string): Promise<void> {
		await this.prisma.forumTopic.update({
			where: { id },
			data: {
				status: ForumTopicStatus.DELETED,
				deletedAt: new Date(),
			},
		});
	}
}
