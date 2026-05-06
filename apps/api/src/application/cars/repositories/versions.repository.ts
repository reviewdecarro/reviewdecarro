import type { CreateVersionDto } from "../dtos/create-version.dto";
import type { CarVersionEntity } from "../entities/car-version.entity";
import type { CarVersionYearEntity } from "../entities/car-version-year.entity";

export abstract class VersionsRepositoryProps {
	abstract create(
		modelId: string,
		data: CreateVersionDto,
	): Promise<CarVersionEntity>;
	abstract findById(id: string): Promise<CarVersionEntity | null>;
	abstract findByModelId(modelId: string): Promise<CarVersionEntity[]>;
	abstract findBySlug(slug: string): Promise<CarVersionEntity | null>;
	abstract findYearsByModelId(modelId: string): Promise<number[]>;
	abstract findYearById(id: string): Promise<CarVersionYearEntity | null>;
}
