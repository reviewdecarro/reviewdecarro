import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BrandEntity } from "../entities/brand.entity";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ListBrandsUseCase } from "./list-brands.usecase";

const mockBrandsRepository = {
	create: jest.fn(),
	findAll: jest.fn(),
	findBySlug: jest.fn(),
	findBySlugWithModels: jest.fn(),
} as unknown as jest.Mocked<BrandsRepositoryProps>;

describe("ListBrandsUseCase", () => {
	let sut: ListBrandsUseCase;

	beforeEach(() => {
		sut = new ListBrandsUseCase(mockBrandsRepository);
		jest.clearAllMocks();
	});

	it("should return list of brands", async () => {
		mockBrandsRepository.findAll.mockResolvedValue([
			new BrandEntity({
				id: "b-1",
				name: "Volkswagen",
				slug: "volkswagen",
				createdAt: new Date(),
			}),
			new BrandEntity({
				id: "b-2",
				name: "Ford",
				slug: "ford",
				createdAt: new Date(),
			}),
		]);

		const result = await sut.execute();

		expect(result).toHaveLength(2);
		expect(result[0]).toHaveProperty("name", "Volkswagen");
		expect(result[1]).toHaveProperty("name", "Ford");
	});

	it("should return empty array when no brands exist", async () => {
		mockBrandsRepository.findAll.mockResolvedValue([]);

		const result = await sut.execute();

		expect(result).toEqual([]);
	});
});
