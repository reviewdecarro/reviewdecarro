import { Expose } from "class-transformer";
import { CarVersionModel } from "../../../../prisma/generated/models/CarVersion";
import { CarVersionYearEntity } from "./car-version-year.entity";

export class CarVersionEntity implements CarVersionModel {
	@Expose()
	id: string;

	@Expose()
	modelId: string;

	@Expose()
	versionName: string;

	@Expose()
	engine: string | null;

	@Expose()
	transmission: string | null;

	@Expose()
	slug: string;

	@Expose()
	createdAt: Date;

	@Expose()
	years?: CarVersionYearEntity[];

	@Expose()
	year?: number;

	constructor(partial: Partial<CarVersionEntity>) {
		Object.assign(this, partial);

		if (!this.year) {
			this.year = this.years?.[0]?.year;
		}
	}
}
