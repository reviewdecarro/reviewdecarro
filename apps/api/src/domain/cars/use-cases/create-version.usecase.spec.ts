import { beforeEach, describe, expect, it } from "@jest/globals";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { CarVersionEntity } from "../entities/car-version.entity";
import { InMemoryBrandsRepository } from "../repositories/in-memory-brands.repository";
import { InMemoryModelsRepository } from "../repositories/in-memory-models.repository";
import { InMemoryVersionsRepository } from "../repositories/in-memory-versions.repository";
import { CreateVersionUseCase } from "./create-version.usecase";

describe("CreateVersionUseCase", () => {
	let brandsRepository: InMemoryBrandsRepository;
	let modelsRepository: InMemoryModelsRepository;
	let versionsRepository: InMemoryVersionsRepository;
	let sut: CreateVersionUseCase;

	beforeEach(() => {
		brandsRepository = new InMemoryBrandsRepository();
		modelsRepository = new InMemoryModelsRepository();
		versionsRepository = new InMemoryVersionsRepository();
		sut = new CreateVersionUseCase(
			brandsRepository,
			modelsRepository,
			versionsRepository,
		);
	});

	const input = {
		year: 2024,
		versionName: "Polo Track 1.0",
		slug: "polo-track-1-0-2024",
	};

	function seedBrandAndModel() {
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
		return { brand, model };
	}

	it("should create a version", async () => {
		const { brand, model } = seedBrandAndModel();

		const result = await sut.execute(brand.slug, model.slug, input);

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("versionName", input.versionName);
		expect(result).toHaveProperty("modelId", model.id);
		expect(versionsRepository.items).toHaveLength(1);
	});

	it("should throw BadRequestError if brand not found", async () => {
		await expect(sut.execute("unknown", "polo", input)).rejects.toThrow(
			"Brand not found",
		);
	});

	it("should throw BadRequestError if model not found", async () => {
		const { brand } = seedBrandAndModel();

		await expect(sut.execute(brand.slug, "unknown", input)).rejects.toThrow(
			"Model not found",
		);
	});

	it("should throw BadRequestError if version slug already exists", async () => {
		const { brand, model } = seedBrandAndModel();
		versionsRepository.items.push(
			new CarVersionEntity({
				id: "existing",
				modelId: model.id,
				year: 2023,
				versionName: "Polo Track",
				engine: null,
				transmission: null,
				slug: input.slug,
				createdAt: new Date(),
			}),
		);

		await expect(sut.execute(brand.slug, model.slug, input)).rejects.toThrow(
			"Version slug already exists",
		);
	});
});
