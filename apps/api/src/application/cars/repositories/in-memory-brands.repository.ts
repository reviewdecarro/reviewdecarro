import { randomUUID } from "node:crypto";
import type { CreateBrandDto } from "../dtos/create-brand.dto";
import { BrandEntity } from "../entities/brand.entity";
import { BrandsRepositoryProps } from "./brands.repository";

export class InMemoryBrandsRepository extends BrandsRepositoryProps {
	public items: BrandEntity[] = [];

	async create(data: CreateBrandDto): Promise<BrandEntity> {
		const brand = new BrandEntity({
			id: randomUUID(),
			name: data.name,
			slug: data.slug,
			createdAt: new Date(),
		});

		this.items.push(brand);

		return brand;
	}

	async findAll(): Promise<BrandEntity[]> {
		return this.items;
	}

	async findBySlug(slug: string): Promise<BrandEntity | null> {
		return this.items.find((brand) => brand.slug === slug) ?? null;
	}

	async findBySlugWithModels(slug: string): Promise<BrandEntity | null> {
		return this.items.find((brand) => brand.slug === slug) ?? null;
	}
}
