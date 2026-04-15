import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { BrandEntity } from "../entities/brand.entity";
import { InMemoryBrandsRepository } from "../repositories/in-memory-brands.repository";
import { CreateBrandUseCase } from "./create-brand.usecase";

describe("CreateBrandUseCase", () => {
	let brandsRepository: InMemoryBrandsRepository;
	let sut: CreateBrandUseCase;

	beforeEach(() => {
		brandsRepository = new InMemoryBrandsRepository();
		sut = new CreateBrandUseCase(brandsRepository);
	});

	const input = { name: "Volkswagen", slug: "volkswagen" };

	it("should create a brand", async () => {
		const result = await sut.execute(input);

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("name", "Volkswagen");
		expect(result).toHaveProperty("slug", "volkswagen");
		expect(result).toHaveProperty("createdAt");
		expect(brandsRepository.items).toHaveLength(1);
	});

	it("should throw BadRequestError if slug already exists", async () => {
		brandsRepository.items.push(
			new BrandEntity({
				id: "existing",
				name: "Volks",
				slug: input.slug,
				createdAt: new Date(),
			}),
		);

		await expect(sut.execute(input)).rejects.toThrow(BadRequestError);
		await expect(sut.execute(input)).rejects.toThrow(
			"Brand slug already exists",
		);
	});
});
