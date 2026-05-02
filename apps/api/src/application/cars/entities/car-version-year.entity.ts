import { Expose } from "class-transformer";
import { CarVersionYearModel } from "../../../../prisma/generated/models/CarVersionYear";

export class CarVersionYearEntity implements CarVersionYearModel {
	@Expose()
	id: string;

	@Expose()
	carVersionId: string;

	@Expose()
	year: number;

	@Expose()
	createdAt: Date;

	constructor(partial: Partial<CarVersionYearEntity>) {
		Object.assign(this, partial);
	}
}
