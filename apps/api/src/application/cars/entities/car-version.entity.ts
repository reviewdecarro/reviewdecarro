import { Expose } from "class-transformer";
import { CarVersionModel } from "../../../../prisma/generated/models/CarVersion";

export class CarVersionEntity implements CarVersionModel {
	@Expose()
	id: string;

	@Expose()
	modelId: string;

	@Expose()
	year: number;

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

	constructor(partial: Partial<CarVersionEntity>) {
		Object.assign(this, partial);
	}
}
