import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { CreateModelUseCase } from "./create-model.usecase";

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

describe("CreateModelUseCase", () => {
  let sut: CreateModelUseCase;

  beforeEach(() => {
    sut = new CreateModelUseCase(mockBrandsRepository, mockModelsRepository);
    jest.clearAllMocks();
  });

  const input = { name: "Polo", slug: "polo" };

  it("should create and return model response DTO", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(
      new BrandEntity({ id: "b-1", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );
    mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(null);
    mockModelsRepository.create.mockResolvedValue(
      new CarModelEntity({ id: "m-1", name: "Polo", slug: "polo", brandId: "b-1", createdAt: new Date() }),
    );

    const result = await sut.execute("volkswagen", input);

    expect(result).toHaveProperty("id", "m-1");
    expect(result).toHaveProperty("name", "Polo");
    expect(result).toHaveProperty("brandId", "b-1");
  });

  it("should throw BadRequestError when brand not found", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(null);

    await expect(sut.execute("nonexistent", input)).rejects.toThrow(BadRequestError);
    await expect(sut.execute("nonexistent", input)).rejects.toThrow("Brand not found");
  });

  it("should throw BadRequestError when slug already exists for brand", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(
      new BrandEntity({ id: "b-1", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );
    mockModelsRepository.findByBrandIdAndSlug.mockResolvedValue(
      new CarModelEntity({ id: "existing", name: "Polo", slug: "polo", brandId: "b-1", createdAt: new Date() }),
    );

    await expect(sut.execute("volkswagen", input)).rejects.toThrow(BadRequestError);
    await expect(sut.execute("volkswagen", input)).rejects.toThrow("Model slug already exists for this brand");
  });
});
