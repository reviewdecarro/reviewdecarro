import { randomUUID } from "node:crypto";
import type { CreateModelDto } from "../dtos/create-model.dto";
import { CarModelEntity } from "../entities/car-model.entity";
import { ModelsRepositoryProps } from "./models.repository";

export class InMemoryModelsRepository extends ModelsRepositoryProps {
	public items: CarModelEntity[] = [];

	async create(brandId: string, data: CreateModelDto): Promise<CarModelEntity> {
		const model = new CarModelEntity({
			id: randomUUID(),
			name: data.name,
			slug: data.slug,
			brandId,
			createdAt: new Date(),
		});

		this.items.push(model);

		return model;
	}

	async findByBrandId(brandId: string): Promise<CarModelEntity[]> {
		return this.items.filter((model) => model.brandId === brandId);
	}

	async findByBrandIdAndSlug(
		brandId: string,
		slug: string,
	): Promise<CarModelEntity | null> {
		return (
			this.items.find(
				(model) => model.brandId === brandId && model.slug === slug,
			) ?? null
		);
	}
}
