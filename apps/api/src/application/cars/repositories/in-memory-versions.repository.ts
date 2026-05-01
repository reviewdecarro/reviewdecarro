import { randomUUID } from "node:crypto";
import type { CreateVersionDto } from "../dtos/create-version.dto";
import { CarVersionEntity } from "../entities/car-version.entity";
import { VersionsRepositoryProps } from "./versions.repository";

export class InMemoryVersionsRepository extends VersionsRepositoryProps {
	public items: CarVersionEntity[] = [];

	async create(
		modelId: string,
		data: CreateVersionDto,
	): Promise<CarVersionEntity> {
		const version = new CarVersionEntity({
			id: randomUUID(),
			modelId,
			year: data.year,
			versionName: data.versionName,
			engine: data.engine ?? null,
			transmission: data.transmission ?? null,
			slug: data.slug,
			createdAt: new Date(),
		});

		this.items.push(version);

		return version;
	}

	async findById(id: string): Promise<CarVersionEntity | null> {
		return this.items.find((v) => v.id === id) ?? null;
	}

	async findByModelId(modelId: string): Promise<CarVersionEntity[]> {
		return this.items.filter((v) => v.modelId === modelId);
	}

	async findBySlug(slug: string): Promise<CarVersionEntity | null> {
		return this.items.find((v) => v.slug === slug) ?? null;
	}
}
