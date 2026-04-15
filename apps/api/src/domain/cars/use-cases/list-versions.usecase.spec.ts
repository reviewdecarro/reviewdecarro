import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { CarVersionEntity } from "../entities/car-version.entity";
import { InMemoryBrandsRepository } from "../repositories/in-memory-brands.repository";
import { InMemoryModelsRepository } from "../repositories/in-memory-models.repository";
import { InMemoryVersionsRepository } from "../repositories/in-memory-versions.repository";
import { ListVersionsUseCase } from "./list-versions.usecase";

describe("ListVersionsUseCase", () => {
	let brandsRepository: InMemoryBrandsRepository;
	let modelsRepository: InMemoryModelsRepository;
	let versionsRepository: InMemoryVersionsRepository;
	let sut: ListVersionsUseCase;

	beforeEach(() => {
		brandsRepository = new InMemoryBrandsRepository();
		modelsRepository = new InMemoryModelsRepository();
		versionsRepository = new InMemoryVersionsRepository();
		sut = new ListVersionsUseCase(
			brandsRepository,
			modelsRepository,
			versionsRepository,
		);
	});

	it("should return versions belonging to the model", async () => {
		const brand = new BrandEntity({
			id: "brand-1",
			name: "VW",
			slug: "vw",
			createdAt: new Date(),
		});
		const model = new CarModelEntity({
			id: "model-1",
			name: "Polo",
			slug: "polo",
			brandId: brand.id,
			createdAt: new Date(),
		});
		brandsRepository.items.push(brand);
		modelsRepository.items.push(model);

		versionsRepository.items.push(
			new CarVersionEntity({
				id: "v1",
				modelId: model.id,
				year: 2024,
				versionName: "Track",
				engine: null,
				transmission: null,
				slug: "track-2024",
				createdAt: new Date(),
			}),
			new CarVersionEntity({
				id: "v2",
				modelId: "other",
				year: 2024,
				versionName: "Other",
				engine: null,
				transmission: null,
				slug: "other",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute(brand.slug, model.slug);

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("slug", "track-2024");
	});

	it("should throw BadRequestError if brand not found", async () => {
		await expect(sut.execute("unknown", "polo")).rejects.toThrow(
			"Brand not found",
		);
	});

	it("should throw BadRequestError if model not found", async () => {
		brandsRepository.items.push(
			new BrandEntity({
				id: "brand-1",
				name: "VW",
				slug: "vw",
				createdAt: new Date(),
			}),
		);

		await expect(sut.execute("vw", "unknown")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("vw", "unknown")).rejects.toThrow(
			"Model not found",
		);
	});
});
