import type { CreateModelDto } from "../dtos/create-model.dto";
import type { CarModelEntity } from "../entities/car-model.entity";

export abstract class ModelsRepositoryProps {
	abstract create(
		brandId: string,
		data: CreateModelDto,
	): Promise<CarModelEntity>;
	abstract findByBrandId(brandId: string): Promise<CarModelEntity[]>;
	abstract findByBrandIdAndSlug(
		brandId: string,
		slug: string,
	): Promise<CarModelEntity | null>;
}
