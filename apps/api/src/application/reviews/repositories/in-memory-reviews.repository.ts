import { randomUUID } from "node:crypto";
import { ReviewStatus } from "../../../../prisma/generated/enums";
import type {
	CreateReviewDto,
	UpdateReviewDto,
} from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewRatingEntity } from "../entities/review-rating.entity";
import {
	type AdminReviewsListParams,
	type AdminReviewsListResult,
	ReviewsRepositoryProps,
} from "./reviews.repository";

export class InMemoryReviewsRepository extends ReviewsRepositoryProps {
	public items: ReviewEntity[] = [];

	async create(
		userId: string,
		slug: string,
		data: CreateReviewDto,
	): Promise<ReviewEntity> {
		const carVersionYearId = data.carVersionYearId ?? "";
		const now = new Date();
		const reviewId = randomUUID();

		const review = new ReviewEntity({
			id: reviewId,
			userId,
			carVersionYearId,
			commentsCount: 0,
			title: data.title,
			slug,
			content: data.content,
			pros: data.pros ?? null,
			cons: data.cons ?? null,
			ownershipTimeMonths: data.ownershipTimeMonths ?? null,
			kmDriven: data.kmDriven ?? null,
			score: data.score,
			status: ReviewStatus.PUBLISHED,
			createdAt: now,
			updatedAt: now,
			ratings: data.ratings?.map(
				(r) =>
					new ReviewRatingEntity({
						id: randomUUID(),
						reviewId,
						category: r.category,
						value: r.value,
					}),
			),
		});

		this.items.push(review);

		return review;
	}

	async findById(id: string): Promise<ReviewEntity | null> {
		return this.items.find((review) => review.id === id) ?? null;
	}

	async findBySlug(slug: string): Promise<ReviewEntity | null> {
		return this.items.find((review) => review.slug === slug) ?? null;
	}

	async findAll(filters?: {
		carVersionYearId?: string;
		username?: string;
		query?: string;
	}): Promise<ReviewEntity[]> {
		let result = [...this.items];

		if (filters?.carVersionYearId) {
			result = result.filter(
				(r) => r.carVersionYearId === filters.carVersionYearId,
			);
		}

		if (filters?.username) {
			result = result.filter((r) => r.user?.username === filters.username);
		}

		if (filters?.query) {
			const q = filters.query.toLowerCase();
			result = result.filter(
				(r) =>
					r.title.toLowerCase().includes(q) ||
					r.content.toLowerCase().includes(q) ||
					r.carVersionYear?.carVersion?.versionName
						.toLowerCase()
						.includes(q) ||
					r.carVersionYear?.carVersion?.model?.name
						.toLowerCase()
						.includes(q) ||
					r.carVersionYear?.carVersion?.model?.brand?.name
						.toLowerCase()
						.includes(q),
			);
		}

		return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	}

	async countPublished(): Promise<number> {
		return this.items.filter((review) => review.status === ReviewStatus.PUBLISHED)
			.length;
	}

	async countByUserId(userId: string): Promise<number> {
		return this.items.filter((review) => review.userId === userId).length;
	}

	async findManyForAdmin(
		params: AdminReviewsListParams,
	): Promise<AdminReviewsListResult> {
		const query = params.query?.trim().toLowerCase();
		const filtered = this.items
			.filter((review) => {
				if (!query) return true;

				const haystack = [
					review.title,
					review.content,
					review.user?.username,
					review.carVersionYear?.year?.toString(),
					review.carVersionYear?.carVersion?.versionName,
					review.carVersionYear?.carVersion?.model?.name,
					review.carVersionYear?.carVersion?.model?.brand?.name,
				]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();

				return haystack.includes(query);
			})
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
		const start = (params.page - 1) * params.limit;

		return {
			reviews: filtered.slice(start, start + params.limit),
			total: filtered.length,
		};
	}

	async findByIdForAdmin(id: string): Promise<ReviewEntity | null> {
		return this.findById(id);
	}

	async update(id: string, data: UpdateReviewDto): Promise<ReviewEntity> {
		const current = this.items.find((r) => r.id === id);

		if (!current) {
			throw new Error(`Review with id ${id} not found`);
		}

		const updated = new ReviewEntity({
			...current,
			title: data.title ?? current.title,
			content: data.content ?? current.content,
			pros: data.pros ?? current.pros,
			cons: data.cons ?? current.cons,
			ownershipTimeMonths:
				data.ownershipTimeMonths ?? current.ownershipTimeMonths,
			kmDriven: data.kmDriven ?? current.kmDriven,
			score: data.score ?? current.score,
			commentsCount: current.commentsCount ?? 0,
			updatedAt: new Date(),
			ratings: data.ratings
				? data.ratings.map(
						(r) =>
							new ReviewRatingEntity({
								id: randomUUID(),
								reviewId: id,
								category: r.category,
								value: r.value,
							}),
					)
				: current.ratings,
		});

		this.items = this.items.map((r) => (r.id === id ? updated : r));

		return updated;
	}

	async incrementCommentsCount(reviewId: string): Promise<void> {
		const review = this.items.find((item) => item.id === reviewId);

		if (review) {
			review.commentsCount = (review.commentsCount ?? 0) + 1;
		}
	}

	async decrementCommentsCount(reviewId: string): Promise<void> {
		const review = this.items.find((item) => item.id === reviewId);

		if (review) {
			review.commentsCount = Math.max((review.commentsCount ?? 0) - 1, 0);
		}
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((review) => review.id !== id);
	}
}
