import { Injectable } from "@nestjs/common";
import {
	CreateReviewDto,
	UpdateReviewDto,
} from "../../../../domain/reviews/dtos/create-review.dto";
import { ReviewEntity } from "../../../../domain/reviews/entities/review.entity";
import { ReviewsRepositoryProps } from "../../../../domain/reviews/repositories/reviews.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaReviewsRepository implements ReviewsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(userId: string, data: CreateReviewDto): Promise<ReviewEntity> {
		const review = await this.prisma.review.create({
			data: {
				userId,
				carVersionId: data.carVersionId,
				title: data.title,
				content: data.content,
				pros: data.pros ?? null,
				cons: data.cons ?? null,
				ownershipTimeMonths: data.ownershipTimeMonths ?? null,
				kmDriven: data.kmDriven ?? null,
				score: data.score,
				ratings: data.ratings
					? {
							create: data.ratings.map((r) => ({
								category: r.category,
								value: r.value,
							})),
						}
					: undefined,
			},
			include: { ratings: true },
		});

		return new ReviewEntity(review);
	}

	async findById(id: string): Promise<ReviewEntity | null> {
		const review = await this.prisma.review.findUnique({
			where: { id },
			include: { ratings: true },
		});

		if (!review) return null;

		return new ReviewEntity(review);
	}

	async findAll(filters?: {
		carVersionId?: string;
		userId?: string;
		query?: string;
	}): Promise<ReviewEntity[]> {
		const where: Record<string, unknown> = {};

		if (filters?.carVersionId) {
			where.carVersionId = filters.carVersionId;
		}

		if (filters?.userId) {
			where.userId = filters.userId;
		}

		if (filters?.query) {
			where.OR = [
				{ title: { contains: filters.query, mode: "insensitive" } },
				{ content: { contains: filters.query, mode: "insensitive" } },
			];
		}

		const reviews = await this.prisma.review.findMany({
			where,
			include: { ratings: true },
			orderBy: { createdAt: "desc" },
		});

		return reviews.map((review) => new ReviewEntity(review));
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
			include: { ratings: true },
		});

		return new ReviewEntity(review);
	}

	async delete(id: string): Promise<void> {
		await this.prisma.reviewRating.deleteMany({ where: { reviewId: id } });
		await this.prisma.reviewVote.deleteMany({ where: { reviewId: id } });
		await this.prisma.comment.deleteMany({ where: { reviewId: id } });
		await this.prisma.review.delete({ where: { id } });
	}
}
