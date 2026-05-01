import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { ListModelsUseCase } from "./list-models.usecase";

const mockBrandsRepository = {
	create: jest.fn(),
	findAll: jest.fn(),
	findBySlug: jest.fn(),
	findBySlugWithModels: jest.fn(),
} as unknown as jest.Mocked<BrandsRepositoryProps>;

const mockModelsRepository = {
	create: jest.fn(),
	findByBrandId: jest.fn(),
	findByBrandIdAndSlug: jest.fn(),
	findByBrandIdAndSlugWithVersions: jest.fn(),
} as unknown as jest.Mocked<ModelsRepositoryProps>;

describe("ListModelsUseCase", () => {
	let sut: ListModelsUseCase;

	beforeEach(() => {
		sut = new ListModelsUseCase(mockBrandsRepository, mockModelsRepository);
		jest.clearAllMocks();
	});

	it("should return list of models for a valid brand slug", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "brand-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandId.mockResolvedValue([
			new CarModelEntity({
				id: "model-1",
				name: "Polo",
				slug: "polo",
				brandId: "brand-1",
				createdAt: new Date(),
			}),
		]);

		const result = await sut.execute("volkswagen");

		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty("name", "Polo");
		expect(result[0]).toHaveProperty("slug", "polo");
		expect(result[0]).toHaveProperty("brandId", "brand-1");
	});

	it("should throw NotFoundError when brand does not exist", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(null);

		await expect(sut.execute("nonexistent")).rejects.toThrow(NotFoundError);
		await expect(sut.execute("nonexistent")).rejects.toThrow("Brand not found");
	});
});
