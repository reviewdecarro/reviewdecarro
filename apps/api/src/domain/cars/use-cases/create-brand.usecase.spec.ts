import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { CreateBrandUseCase } from "./create-brand.usecase";

const mockBrandsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findBySlug: jest.fn(),
  findBySlugWithModels: jest.fn(),
} as unknown as jest.Mocked<BrandsRepositoryProps>;

describe("CreateBrandUseCase", () => {
  let sut: CreateBrandUseCase;

  beforeEach(() => {
    sut = new CreateBrandUseCase(mockBrandsRepository);
    jest.clearAllMocks();
  });

  const input = { name: "Volkswagen", slug: "volkswagen" };

  it("should create and return brand response DTO", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(null);
    mockBrandsRepository.create.mockResolvedValue(
      new BrandEntity({ id: "b-1", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );

    const result = await sut.execute(input);

    expect(result).toHaveProperty("id", "b-1");
    expect(result).toHaveProperty("name", "Volkswagen");
    expect(result).toHaveProperty("slug", "volkswagen");
    expect(result).toHaveProperty("createdAt");
  });

  it("should throw BadRequestError if slug already exists", async () => {
    mockBrandsRepository.findBySlug.mockResolvedValue(
      new BrandEntity({ id: "existing", name: "Volkswagen", slug: "volkswagen", createdAt: new Date() }),
    );

    await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
    await expect(sut.execute(input)).rejects.toThrow("Brand slug already exists");
  });
});
