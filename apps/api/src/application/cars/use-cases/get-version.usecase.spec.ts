import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { CarVersionEntity } from "../entities/car-version.entity";
import { VersionsRepositoryProps } from "../repositories/versions.repository";
import { GetVersionUseCase } from "./get-version.usecase";

const mockVersionsRepository: jest.Mocked<VersionsRepositoryProps> = {
	create: jest.fn(),
	findById: jest.fn(),
	findByModelId: jest.fn(),
	findBySlug: jest.fn(),
	findYearsByModelId: jest.fn(),
	findYearById: jest.fn(),
};

describe("GetVersionUseCase", () => {
	let sut: GetVersionUseCase;

	beforeEach(() => {
		sut = new GetVersionUseCase(mockVersionsRepository);
		jest.clearAllMocks();
	});

	it("should return version details by slug", async () => {
		mockVersionsRepository.findBySlug.mockResolvedValue(
			new CarVersionEntity({
				id: "v-1",
				modelId: "model-1",
				year: 2024,
				versionName: "Track",
				engine: "1.0 MPI",
				transmission: "Manual",
				slug: "2024-track",
				createdAt: new Date(),
			}),
		);

		const result = await sut.execute("2024-track");

		expect(result).toHaveProperty("id", "v-1");
		expect(result).toHaveProperty("year", 2024);
		expect(result).toHaveProperty("versionName", "Track");
		expect(result).toHaveProperty("engine", "1.0 MPI");
		expect(result).toHaveProperty("slug", "2024-track");
	});

	it("should throw NotFoundError when version slug does not exist", async () => {
		mockVersionsRepository.findBySlug.mockResolvedValue(null);

		await expect(sut.execute("nonexistent")).rejects.toThrow(NotFoundError);
		await expect(sut.execute("nonexistent")).rejects.toThrow(
			"Car version not found",
		);
	});
});
