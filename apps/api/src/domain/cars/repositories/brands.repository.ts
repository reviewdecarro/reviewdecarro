import type { CreateBrandDto } from "../dtos/create-brand.dto";
import type { BrandEntity } from "../entities/brand.entity";

export abstract class BrandsRepositoryProps {
	abstract create(data: CreateBrandDto): Promise<BrandEntity>;
	abstract findAll(): Promise<BrandEntity[]>;
	abstract findBySlug(slug: string): Promise<BrandEntity | null>;
	abstract findBySlugWithModels(slug: string): Promise<BrandEntity | null>;
}
