import { beforeEach, describe, expect, it } from "@jest/globals";
import { BrandEntity } from "../entities/brand.entity";
import { InMemoryBrandsRepository } from "../repositories/in-memory-brands.repository";
import { ListBrandsUseCase } from "./list-brands.usecase";

describe("ListBrandsUseCase", () => {
	let brandsRepository: InMemoryBrandsRepository;
	let sut: ListBrandsUseCase;

	beforeEach(() => {
		brandsRepository = new InMemoryBrandsRepository();
		sut = new ListBrandsUseCase(brandsRepository);
	});

	it("should return an empty list when no brands exist", async () => {
		const result = await sut.execute();

		expect(result).toEqual([]);
	});

	it("should return all brands", async () => {
		brandsRepository.items.push(
			new BrandEntity({
				id: "1",
				name: "VW",
				slug: "vw",
				createdAt: new Date(),
			}),
			new BrandEntity({
				id: "2",
				name: "Fiat",
				slug: "fiat",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute();

		expect(result).toHaveLength(2);
		expect(result[0]).toHaveProperty("slug", "vw");
		expect(result[1]).toHaveProperty("slug", "fiat");
	});
});
