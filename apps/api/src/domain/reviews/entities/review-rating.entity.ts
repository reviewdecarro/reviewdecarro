import { Expose } from "class-transformer";
import { RatingCategory } from "../../../../prisma/generated/enums";
import { ReviewRatingModel } from "../../../../prisma/generated/models/ReviewRating";

export class ReviewRatingEntity implements ReviewRatingModel {
	@Expose()
	id: string;

	@Expose()
	reviewId: string;

	@Expose()
	category: RatingCategory;

	@Expose()
	value: number;

	constructor(partial: Partial<ReviewRatingEntity>) {
		Object.assign(this, partial);
	}
}
