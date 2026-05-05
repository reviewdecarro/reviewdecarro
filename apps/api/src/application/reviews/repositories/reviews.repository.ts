import { CreateReviewDto, UpdateReviewDto } from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";

export abstract class ReviewsRepositoryProps {
	abstract create(
		userId: string,
		slug: string,
		data: CreateReviewDto,
	): Promise<ReviewEntity>;
	abstract findById(id: string): Promise<ReviewEntity | null>;
	abstract findBySlug(slug: string): Promise<ReviewEntity | null>;
	abstract findAll(filters?: {
		carVersionYearId?: string;
		username?: string;
		query?: string;
	}): Promise<ReviewEntity[]>;
	abstract update(id: string, data: UpdateReviewDto): Promise<ReviewEntity>;
	abstract incrementCommentsCount(reviewId: string): Promise<void>;
	abstract decrementCommentsCount(reviewId: string): Promise<void>;
	abstract delete(id: string): Promise<void>;
}
