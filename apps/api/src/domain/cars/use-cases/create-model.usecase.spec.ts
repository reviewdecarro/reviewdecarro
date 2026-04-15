import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { InMemoryBrandsRepository } from "../repositories/in-memory-brands.repository";
import { InMemoryModelsRepository } from "../repositories/in-memory-models.repository";
import { CreateModelUseCase } from "./create-model.usecase";

describe("CreateModelUseCase", () => {
	let brandsRepository: InMemoryBrandsRepository;
	let modelsRepository: InMemoryModelsRepository;
	let sut: CreateModelUseCase;

	beforeEach(() => {
		brandsRepository = new InMemoryBrandsRepository();
		modelsRepository = new InMemoryModelsRepository();
		sut = new CreateModelUseCase(brandsRepository, modelsRepository);
	});

	const input = { name: "Polo", slug: "polo" };

	function seedBrand() {
		const brand = new BrandEntity({
			id: "brand-1",
			name: "VW",
			slug: "vw",
			createdAt: new Date(),
		});
		brandsRepository.items.push(brand);
		return brand;
	}

	it("should create a model for the given brand", async () => {
		const brand = seedBrand();

		const result = await sut.execute(brand.slug, input);

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("name", "Polo");
		expect(result).toHaveProperty("brandId", brand.id);
		expect(modelsRepository.items).toHaveLength(1);
	});

	it("should throw BadRequestError if brand not found", async () => {
		await expect(sut.execute("unknown", input)).rejects.toThrow(
			BadRequestError,
		);
		await expect(sut.execute("unknown", input)).rejects.toThrow(
			"Brand not found",
		);
	});

	it("should throw BadRequestError if slug already exists for brand", async () => {
		const brand = seedBrand();
		modelsRepository.items.push(
			new CarModelEntity({
				id: "existing",
				name: "Polo",
				slug: input.slug,
				brandId: brand.id,
				createdAt: new Date(),
			}),
		);

		await expect(sut.execute(brand.slug, input)).rejects.toThrow(
			"Model slug already exists for this brand",
		);
	});
});
