import { Expose } from "class-transformer";
import { ReviewRatingEntity } from "./review-rating.entity";

export class ReviewEntity {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	carVersionYearId: string;

	@Expose()
	carVersionId?: string;

	@Expose()
	commentsCount: number;

	@Expose()
	title: string;

	@Expose()
	slug: string;

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

	@Expose()
	user?: {
		id: string;
		username: string;
	};

	@Expose()
	carVersionYear?: {
		id: string;
		year: number;
		carVersion?: {
			id: string;
			versionName: string;
			slug: string;
			model?: {
				id: string;
				name: string;
				slug: string;
				brand?: {
					id: string;
					name: string;
					slug: string;
				};
			};
		};
	};

	constructor({ ratings, ...partial }: Partial<ReviewEntity>) {
		Object.assign(this, partial);

		if (!this.carVersionYearId && this.carVersionId) {
			this.carVersionYearId = this.carVersionId;
		}

		if (!this.carVersionId) {
			this.carVersionId = this.carVersionYearId;
		}

		if (this.commentsCount === undefined) {
			this.commentsCount = 0;
		}

		if (ratings) {
			this.ratings = ratings.map((r) => new ReviewRatingEntity(r));
		}
	}
}
