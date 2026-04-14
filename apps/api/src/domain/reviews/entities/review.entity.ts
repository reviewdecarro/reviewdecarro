import { Expose } from "class-transformer";
import { ReviewModel } from "../../../../prisma/generated/models/Review";
import { ReviewRatingEntity } from "./review-rating.entity";

export class ReviewEntity implements ReviewModel {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	carVersionId: string;

	@Expose()
	title: string;

	@Expose()
	content: string;

	@Expose()
	pros: string | null;

	@Expose()
	cons: string | null;

	@Expose()
	ownershipTimeMonths: number | null;

	@Expose()
	kmDriven: number | null;

	@Expose()
	score: number;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	ratings?: ReviewRatingEntity[];

	constructor({ ratings, ...partial }: Partial<ReviewEntity>) {
		Object.assign(this, partial);

		if (ratings) {
			this.ratings = ratings.map((r) => new ReviewRatingEntity(r));
		}
	}
}
