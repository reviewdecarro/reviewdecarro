import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { BrandEntity } from "../entities/brand.entity";
import { CarModelEntity } from "../entities/car-model.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { GetBrandUseCase } from "./get-brand.usecase";

const mockBrandsRepository: jest.Mocked<BrandsRepositoryProps> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findBySlug: jest.fn(),
  findBySlugWithModels: jest.fn(),
};

describe("GetBrandUseCase", () => {
  let sut: GetBrandUseCase;

  beforeEach(() => {
    sut = new GetBrandUseCase(mockBrandsRepository);
    jest.clearAllMocks();
  });

  it("should return brand with its models", async () => {
    mockBrandsRepository.findBySlugWithModels.mockResolvedValue(
      new BrandEntity({
        id: "brand-1",
        name: "Volkswagen",
        slug: "volkswagen",
        createdAt: new Date(),
        models: [
          new CarModelEntity({ id: "model-1", name: "Polo", slug: "polo", brandId: "brand-1", createdAt: new Date() }),
        ],
      }),
    );

    const result = await sut.execute("volkswagen");

    expect(result).toHaveProperty("name", "Volkswagen");
    expect(result).toHaveProperty("slug", "volkswagen");
    expect(result.models).toHaveLength(1);
    expect(result.models[0]).toHaveProperty("name", "Polo");
  });

  it("should return brand with empty models array when brand has no models", async () => {
    mockBrandsRepository.findBySlugWithModels.mockResolvedValue(
      new BrandEntity({ id: "brand-1", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );

    const result = await sut.execute("volkswagen");

    expect(result).toHaveProperty("name", "Volkswagen");
    expect(result.models).toEqual([]);
  });

  it("should throw NotFoundError when brand does not exist", async () => {
    mockBrandsRepository.findBySlugWithModels.mockResolvedValue(null);

    await expect(sut.execute("nonexistent")).rejects.toThrow(NotFoundError);
    await expect(sut.execute("nonexistent")).rejects.toThrow("Brand not found");
  });
});
