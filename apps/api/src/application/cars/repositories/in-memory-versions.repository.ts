import { randomUUID } from "node:crypto";
import type { CreateVersionDto } from "../dtos/create-version.dto";
import { CarVersionEntity } from "../entities/car-version.entity";
import { CarVersionYearEntity } from "../entities/car-version-year.entity";
import { VersionsRepositoryProps } from "./versions.repository";

export class InMemoryVersionsRepository extends VersionsRepositoryProps {
	public items: CarVersionEntity[] = [];

	async create(
		modelId: string,
		data: CreateVersionDto,
	): Promise<CarVersionEntity> {
		const versionId = randomUUID();
		const yearId = randomUUID();
		const version = new CarVersionEntity({
			id: versionId,
			modelId,
			versionName: data.versionName,
			engine: data.engine ?? null,
			transmission: data.transmission ?? null,
			slug: data.slug,
			createdAt: new Date(),
			years: [],
		});

		version.years = [
			new CarVersionYearEntity({
				id: yearId,
				carVersionId: versionId,
				year: data.year,
				createdAt: new Date(),
			}),
		];
		version.year = data.year;

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

	async findYearsByModelId(modelId: string): Promise<number[]> {
		const years = this.items.flatMap((version) => {
			if (version.modelId !== modelId) {
				return [];
			}

			if (version.years?.length) {
				return version.years.map((item) => item.year);
			}

			return version.year ? [version.year] : [];
		});

		return [...new Set(years)].sort((a, b) => b - a);
	}

	async findYearById(id: string): Promise<CarVersionYearEntity | null> {
		for (const version of this.items) {
			const year = version.years?.find((item) => item.id === id);

			if (year) {
				return year;
			}
		}

		return null;
	}
}
