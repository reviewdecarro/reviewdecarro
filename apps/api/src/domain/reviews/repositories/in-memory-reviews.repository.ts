import { randomUUID } from "node:crypto";
import type {
	CreateReviewDto,
	UpdateReviewDto,
} from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewRatingEntity } from "../entities/review-rating.entity";
import { ReviewsRepositoryProps } from "./reviews.repository";

export class InMemoryReviewsRepository extends ReviewsRepositoryProps {
	public items: ReviewEntity[] = [];

	async create(
		userId: string,
		slug: string,
		data: CreateReviewDto,
	): Promise<ReviewEntity> {
		const now = new Date();
		const reviewId = randomUUID();

		const review = new ReviewEntity({
			id: reviewId,
			userId,
			carVersionId: data.carVersionId,
			title: data.title,
			slug,
			content: data.content,
			pros: data.pros ?? null,
			cons: data.cons ?? null,
			ownershipTimeMonths: data.ownershipTimeMonths ?? null,
			kmDriven: data.kmDriven ?? null,
			score: data.score,
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
		carVersionId?: string;
		userId?: string;
		query?: string;
	}): Promise<ReviewEntity[]> {
		let result = [...this.items];

		if (filters?.carVersionId) {
			result = result.filter((r) => r.carVersionId === filters.carVersionId);
		}

		if (filters?.userId) {
			result = result.filter((r) => r.userId === filters.userId);
		}

		if (filters?.query) {
			const q = filters.query.toLowerCase();
			result = result.filter(
				(r) =>
					r.title.toLowerCase().includes(q) ||
					r.content.toLowerCase().includes(q),
			);
		}

		return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((review) => review.id !== id);
	}
}
