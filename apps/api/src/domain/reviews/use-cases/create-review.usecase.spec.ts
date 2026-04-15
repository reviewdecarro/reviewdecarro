import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CarVersionEntity } from "../../cars/entities/car-version.entity";
import { InMemoryVersionsRepository } from "../../cars/repositories/in-memory-versions.repository";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { CreateReviewUseCase } from "./create-review.usecase";

describe("CreateReviewUseCase", () => {
	let reviewsRepository: InMemoryReviewsRepository;
	let versionsRepository: InMemoryVersionsRepository;
	let sut: CreateReviewUseCase;

	beforeEach(() => {
		reviewsRepository = new InMemoryReviewsRepository();
		versionsRepository = new InMemoryVersionsRepository();
		sut = new CreateReviewUseCase(reviewsRepository, versionsRepository);
	});

	function seedVersion() {
		const version = new CarVersionEntity({
			id: "version-1",
			modelId: "model-1",
			year: 2024,
			versionName: "Track",
			engine: null,
			transmission: null,
			slug: "track-2024",
			createdAt: new Date(),
		});
		versionsRepository.items.push(version);
		return version;
	}

	it("should create a review", async () => {
		const version = seedVersion();

		const result = await sut.execute("user-1", {
			carVersionId: version.id,
			title: "Ótimo carro",
			content: "Conteúdo do review",
			score: 4.5,
		});

		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("title", "Ótimo carro");
		expect(result).toHaveProperty("userId", "user-1");
		expect(reviewsRepository.items).toHaveLength(1);
	});

	it("should throw BadRequestError when car version not found", async () => {
		await expect(
			sut.execute("user-1", {
				carVersionId: "unknown",
				title: "Ótimo",
				content: "Conteúdo",
				score: 4,
			}),
		).rejects.toThrow(BadRequestError);

		await expect(
			sut.execute("user-1", {
				carVersionId: "unknown",
				title: "Ótimo",
				content: "Conteúdo",
				score: 4,
			}),
		).rejects.toThrow("Car version not found");
	});
});
