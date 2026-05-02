import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { CarVersionEntity } from "../entities/car-version.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { VersionsRepositoryProps } from "../repositories/versions.repository";
import { CreateVersionUseCase } from "./create-version.usecase";

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

const mockVersionsRepository: jest.Mocked<VersionsRepositoryProps> = {
	create: jest.fn(),
	findById: jest.fn(),
	findByModelId: jest.fn(),
	findBySlug: jest.fn(),
	findYearsByModelId: jest.fn(),
	findYearById: jest.fn(),
};

describe("CreateVersionUseCase", () => {
	let sut: CreateVersionUseCase;

	beforeEach(() => {
		sut = new CreateVersionUseCase(
			mockBrandsRepository,
			mockModelsRepository,
			mockVersionsRepository,
		);
		jest.clearAllMocks();
	});

	const input = {
		year: 2024,
		versionName: "Track",
		engine: "1.0 MPI",
		transmission: "Manual",
		slug: "2024-track",
	};

	it("should create and return version response DTO", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "b-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(
			new CarModelEntity({
				id: "m-1",
				name: "Polo",
				slug: "polo",
				brandId: "b-1",
				createdAt: new Date(),
			}),
		);
		mockVersionsRepository.findBySlug.mockResolvedValue(null);
		mockVersionsRepository.create.mockResolvedValue(
			new CarVersionEntity({
				id: "v-1",
				modelId: "m-1",
				year: 2024,
				versionName: "Track",
				engine: "1.0 MPI",
				transmission: "Manual",
				slug: "2024-track",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute("volkswagen", "polo", input);

		expect(result).toHaveProperty("id", "v-1");
		expect(result).toHaveProperty("year", 2024);
		expect(result).toHaveProperty("slug", "2024-track");
	});

	it("should throw BadRequestError when brand not found", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(null);

		await expect(sut.execute("nonexistent", "polo", input)).rejects.toThrow(
			BadRequestError,
		);
		await expect(sut.execute("nonexistent", "polo", input)).rejects.toThrow(
			"Brand not found",
		);
	});

	it("should throw BadRequestError when model not found", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "b-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(null);

		await expect(
			sut.execute("volkswagen", "nonexistent", input),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute("volkswagen", "nonexistent", input),
		).rejects.toThrow("Model not found");
	});

	it("should throw BadRequestError when version slug already exists", async () => {
		mockBrandsRepository.findBySlug.mockResolvedValue(
			new BrandEntity({
				id: "b-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
		);
		mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(
			new CarModelEntity({
				id: "m-1",
				name: "Polo",
				slug: "polo",
				brandId: "b-1",
				createdAt: new Date(),
			}),
		);
		mockVersionsRepository.findBySlug.mockResolvedValue(
			new CarVersionEntity({
				id: "existing",
				modelId: "m-1",
				year: 2024,
				versionName: "Track",
				engine: null,
				transmission: null,
				slug: "2024-track",
				createdAt: new Date(),
			}),
		);

		await expect(sut.execute("volkswagen", "polo", input)).rejects.toThrow(
			BadRequestError,
		);
		await expect(sut.execute("volkswagen", "polo", input)).rejects.toThrow(
			"Version slug already exists",
		);
	});
});
