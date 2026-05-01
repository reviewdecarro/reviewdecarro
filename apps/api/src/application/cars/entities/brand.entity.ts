import { Expose } from "class-transformer";
import { BrandModel } from "../../../../prisma/generated/models/Brand";
import { CarModelEntity } from "./car-model.entity";

export class BrandEntity implements BrandModel {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	slug: string;

	@Expose()
	createdAt: Date;

	@Expose()
	models?: CarModelEntity[];

	constructor({ models, ...partial }: Partial<BrandEntity>) {
		Object.assign(this, partial);

		this.models = models
			? models.map((model) => new CarModelEntity(model))
			: [];
	}
}
