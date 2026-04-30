import { Expose } from "class-transformer";
import { ModelModel } from "../../../../prisma/generated/models/Model";
import { CarVersionEntity } from "./car-version.entity";

export class CarModelEntity implements ModelModel {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	slug: string;

	@Expose()
	brandId: string;

	@Expose()
	createdAt: Date;

	@Expose()
	carVersions?: CarVersionEntity[];

	constructor({ carVersions, ...partial }: Partial<CarModelEntity>) {
		Object.assign(this, partial);
		this.carVersions = carVersions ? carVersions.map((v) => new CarVersionEntity(v)) : [];
	}
}
