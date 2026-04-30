import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { CarVersionEntity } from "../entities/car-version.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { VersionsRepositoryProps } from "../repositories/versions.repository";
import { ListVersionsUseCase } from "./list-versions.usecase";

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
};

describe("ListVersionsUseCase", () => {
  let sut: ListVersionsUseCase;

  beforeEach(() => {
    sut = new ListVersionsUseCase(
      mockBrandsRepository,
      mockModelsRepository,
      mockVersionsRepository,
    );
    jest.clearAllMocks();
  });

  it("should return list of versions for a valid brand+model slug", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(
      new BrandEntity({ id: "brand-1", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );
    mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(
      new CarModelEntity({ id: "model-1", name: "Polo", slug: "polo", brandId: "brand-1", createdAt: new Date() }),
    );
    mockVersionsRepository.findByModelId.mockResolvedValue([
      new CarVersionEntity({ id: "v-1", modelId: "model-1", year: 2024, versionName: "Track", engine: "1.0 MPI", transmission: null, slug: "2024-track", createdAt: new Date() }),
    ]);

    const result = await sut.execute("volkswagen", "polo");

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("year", 2024);
    expect(result[0]).toHaveProperty("versionName", "Track");
  });

  it("should throw NotFoundError when brand does not exist", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(null);

    await expect(sut.execute("nonexistent", "polo")).rejects.toThrow(NotFoundError);
    await expect(sut.execute("nonexistent", "polo")).rejects.toThrow("Brand not found");
  });

  it("should throw NotFoundError when model does not exist", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(
      new BrandEntity({ id: "brand-1", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );
    mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(null);

    await expect(sut.execute("volkswagen", "nonexistent")).rejects.toThrow(NotFoundError);
    await expect(sut.execute("volkswagen", "nonexistent")).rejects.toThrow("Model not found");
  });
});
