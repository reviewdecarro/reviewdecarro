import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { CarVersionEntity } from "../entities/car-version.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { GetModelUseCase } from "./get-model.usecase";

const mockBrandsRepository: jest.Mocked<BrandsRepositoryProps> = {
	create: jest.fn(),
	findAll: jest.fn(),
	findBySlug: jest.fn(),
	findBySlugWithModels: jest.fn(),
};

const mockModelsRepository: jest.Mocked<ModelsRepositoryProps> = {
	create: jest.fn(),
	findByBrandId: jest.fn(),
	findByBrandIdAndSlug: jest.fn(),
	findByBrandIdAndSlugWithVersions: jest.fn(),
};

describe("GetModelUseCase", () => {
	let sut: GetModelUseCase;

	beforeEach(() => {
		sut = new GetModelUseCase(mockBrandsRepository, mockModelsRepository);
		jest.clearAllMocks();
	});

	it("should return model with its car versions", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "brand-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandIdAndSlugWithVersions.mockResolvedValue(
			new CarModelEntity({
				id: "model-1",
				name: "Polo",
				slug: "polo",
				brandId: "brand-1",
				createdAt: new Date(),
				carVersions: [
					new CarVersionEntity({
						id: "v-1",
						modelId: "model-1",
						year: 2024,
						versionName: "Track",
						engine: "1.0 MPI",
						transmission: null,
						slug: "2024-track",
						createdAt: new Date(),
					}),
				],
			}),
		);

		const result = await sut.execute("volkswagen", "polo");

		expect(result).toHaveProperty("name", "Polo");
		expect(result).toHaveProperty("brandId", "brand-1");
		expect(result.carVersions).toHaveLength(1);
		expect(result.carVersions[0]).toHaveProperty("year", 2024);
	});

	it("should return model with empty carVersions array when model has no versions", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "brand-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandIdAndSlugWithVersions.mockResolvedValue(
			new CarModelEntity({
				id: "model-1",
				name: "Polo",
				slug: "polo",
				brandId: "brand-1",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute("volkswagen", "polo");

		expect(result).toHaveProperty("name", "Polo");
		expect(result.carVersions).toEqual([]);
	});

	it("should throw NotFoundError when brand does not exist", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(null);

		await expect(sut.execute("nonexistent", "polo")).rejects.toThrow(
			NotFoundError,
		);
		await expect(sut.execute("nonexistent", "polo")).rejects.toThrow(
			"Brand not found",
		);
	});

	it("should throw NotFoundError when model does not exist in that brand", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "brand-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandIdAndSlugWithVersions.mockResolvedValue(
			null,
		);

		await expect(sut.execute("volkswagen", "nonexistent")).rejects.toThrow(
			NotFoundError,
		);
		await expect(sut.execute("volkswagen", "nonexistent")).rejects.toThrow(
			"Model not found",
		);
	});
});
