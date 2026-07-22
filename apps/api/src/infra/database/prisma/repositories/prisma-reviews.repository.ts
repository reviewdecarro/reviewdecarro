import { Injectable } from "@nestjs/common";
import { ReviewStatus } from "../../../../../prisma/generated/enums";
import {
	CreateReviewDto,
	UpdateReviewDto,
} from "../../../../application/reviews/dtos/create-review.dto";
import { ReviewEntity } from "../../../../application/reviews/entities/review.entity";
import {
	type AdminReviewsListParams,
	type AdminReviewsListResult,
	ReviewsRepositoryProps,
} from "../../../../application/reviews/repositories/reviews.repository";
import { PrismaService } from "../prisma.service";

const reviewInclude = {
	ratings: true,
	user: {
		select: {
			id: true,
			username: true,
		},
	},
	carVersionYear: {
		include: {
			carVersion: {
				include: {
					model: {
						include: {
							brand: true,
						},
					},
				},
			},
		},
	},
	_count: {
		select: {
			comments: true,
		},
	},
} as const;

@Injectable()
export class PrismaReviewsRepository implements ReviewsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(
		userId: string,
		slug: string,
		data: CreateReviewDto,
	): Promise<ReviewEntity> {
		const carVersionYearId = data.carVersionYearId ?? "";

		const review = await this.prisma.review.create({
			data: {
				userId,
				carVersionYearId,
				title: data.title,
				slug,
				content: data.content,
				pros: data.pros ?? null,
				cons: data.cons ?? null,
				ownershipTimeMonths: data.ownershipTimeMonths ?? null,
				kmDriven: data.kmDriven ?? null,
				score: data.score,
				status: ReviewStatus.PUBLISHED,
				ratings: data.ratings
					? {
							create: data.ratings.map((r) => ({
								category: r.category,
								value: r.value,
							})),
						}
					: undefined,
			},
			include: reviewInclude,
		});

		return new ReviewEntity({
			...review,
			commentsCount: review._count.comments,
		});
	}

	async findById(id: string): Promise<ReviewEntity | null> {
		const review = await this.prisma.review.findUnique({
			where: { id },
			include: reviewInclude,
		});

		if (!review) return null;

		return new ReviewEntity({
			...review,
			commentsCount: review._count.comments,
		});
	}

	async findBySlug(slug: string): Promise<ReviewEntity | null> {
		const review = await this.prisma.review.findUnique({
			where: { slug },
			include: reviewInclude,
		});

		if (!review) return null;

		return new ReviewEntity(review);
	}

	async findAll(filters?: {
		carVersionYearId?: string;
		username?: string;
		query?: string;
	}): Promise<ReviewEntity[]> {
		const where: Record<string, unknown> = {};

		if (filters?.carVersionYearId) {
			where.carVersionYearId = filters.carVersionYearId;
		}

		if (filters?.username) {
			where.user = { username: filters.username };
		}

		if (filters?.query) {
			where.OR = [
				{ title: { contains: filters.query, mode: "insensitive" } },
				{ content: { contains: filters.query, mode: "insensitive" } },
				{
					carVersionYear: {
						carVersion: {
							versionName: { contains: filters.query, mode: "insensitive" },
						},
					},
				},
				{
					carVersionYear: {
						carVersion: {
							model: {
								name: { contains: filters.query, mode: "insensitive" },
							},
						},
					},
				},
				{
					carVersionYear: {
						carVersion: {
							model: {
								brand: {
									name: { contains: filters.query, mode: "insensitive" },
								},
							},
						},
					},
				},
			];
		}

		const reviews = await this.prisma.review.findMany({
			where,
			include: reviewInclude,
			orderBy: { createdAt: "desc" },
		});

		return reviews.map(
			(review) =>
				new ReviewEntity({
					...review,
					commentsCount: review._count.comments,
				}),
		);
	}

	async countPublished(): Promise<number> {
		return this.prisma.review.count({
			where: { status: ReviewStatus.PUBLISHED },
		});
	}

	async countByUserId(userId: string): Promise<number> {
		return this.prisma.review.count({ where: { userId } });
	}

	async findManyForAdmin(
		params: AdminReviewsListParams,
	): Promise<AdminReviewsListResult> {
		const query = params.query?.trim();
		const year = query && /^\d+$/.test(query) ? Number(query) : undefined;
		const where = query
			? {
					OR: [
						{ title: { contains: query, mode: "insensitive" as const } },
						{ content: { contains: query, mode: "insensitive" as const } },
						{
							user: {
								username: { contains: query, mode: "insensitive" as const },
							},
						},
						{
							carVersionYear: {
								year,
							},
						},
						{
							carVersionYear: {
								carVersion: {
									versionName: {
										contains: query,
										mode: "insensitive" as const,
									},
								},
							},
						},
						{
							carVersionYear: {
								carVersion: {
									model: {
										name: { contains: query, mode: "insensitive" as const },
									},
								},
							},
						},
						{
							carVersionYear: {
								carVersion: {
									model: {
										brand: {
											name: {
												contains: query,
												mode: "insensitive" as const,
											},
										},
									},
								},
							},
						},
					],
				}
			: {};

		const [reviews, total] = await this.prisma.$transaction([
			this.prisma.review.findMany({
				where,
				include: reviewInclude,
				orderBy: { createdAt: "desc" },
				skip: (params.page - 1) * params.limit,
				take: params.limit,
			}),
			this.prisma.review.count({ where }),
		]);

		return {
			reviews: reviews.map(
				(review) =>
					new ReviewEntity({
						...review,
						commentsCount: review._count.comments,
					}),
			),
			total,
		};
	}

	async findByIdForAdmin(id: string): Promise<ReviewEntity | null> {
		return this.findById(id);
	}

	async update(id: string, data: UpdateReviewDto): Promise<ReviewEntity> {
		const updateData: Record<string, unknown> = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.content !== undefined) updateData.content = data.content;
		if (data.pros !== undefined) updateData.pros = data.pros;
		if (data.cons !== undefined) updateData.cons = data.cons;
		if (data.ownershipTimeMonths !== undefined)
			updateData.ownershipTimeMonths = data.ownershipTimeMonths;
		if (data.kmDriven !== undefined) updateData.kmDriven = data.kmDriven;
		if (data.score !== undefined) updateData.score = data.score;

		if (data.ratings) {
			await this.prisma.reviewRating.deleteMany({ where: { reviewId: id } });
			updateData.ratings = {
				create: data.ratings.map((r) => ({
					category: r.category,
					value: r.value,
				})),
			};
		}

		const review = await this.prisma.review.update({
			where: { id },
			data: updateData,
			include: reviewInclude,
		});

		return new ReviewEntity({
			...review,
			commentsCount: review._count.comments,
		});
	}

	async incrementCommentsCount(reviewId: string): Promise<void> {
		await this.prisma.review.update({
			where: { id: reviewId },
			data: {
				commentsCount: {
					increment: 1,
				},
			},
		});
	}

	async decrementCommentsCount(reviewId: string): Promise<void> {
		await this.prisma.review.update({
			where: { id: reviewId },
			data: {
				commentsCount: {
					decrement: 1,
				},
			},
		});
	}

	async delete(id: string): Promise<void> {
		await this.prisma.reviewRating.deleteMany({ where: { reviewId: id } });
		await this.prisma.reviewVote.deleteMany({ where: { reviewId: id } });
		await this.prisma.comment.deleteMany({ where: { reviewId: id } });
		await this.prisma.review.delete({ where: { id } });
	}
}
