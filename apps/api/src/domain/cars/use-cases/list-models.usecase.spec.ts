import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { InMemoryBrandsRepository } from "../repositories/in-memory-brands.repository";
import { InMemoryModelsRepository } from "../repositories/in-memory-models.repository";
import { ListModelsUseCase } from "./list-models.usecase";

describe("ListModelsUseCase", () => {
	let brandsRepository: InMemoryBrandsRepository;
	let modelsRepository: InMemoryModelsRepository;
	let sut: ListModelsUseCase;

	beforeEach(() => {
		brandsRepository = new InMemoryBrandsRepository();
		modelsRepository = new InMemoryModelsRepository();
		sut = new ListModelsUseCase(brandsRepository, modelsRepository);
	});

	it("should return models belonging to the brand", async () => {
		const brand = new BrandEntity({
			id: "brand-1",
			name: "VW",
			slug: "vw",
			createdAt: new Date(),
		});
		brandsRepository.items.push(brand);

		modelsRepository.items.push(
			new CarModelEntity({
				id: "m1",
				name: "Polo",
				slug: "polo",
				brandId: brand.id,
				createdAt: new Date(),
			}),
			new CarModelEntity({
				id: "m2",
				name: "Uno",
				slug: "uno",
				brandId: "other",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute(brand.slug);

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("slug", "polo");
	});

	it("should throw BadRequestError if brand not found", async () => {
		await expect(sut.execute("unknown")).rejects.toThrow(BadRequestError);
		await expect(sut.execute("unknown")).rejects.toThrow("Brand not found");
	});
});
