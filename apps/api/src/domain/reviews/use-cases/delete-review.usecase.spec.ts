import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { RoleEntity } from "../../roles/entities/role.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { ReviewEntity } from "../entities/review.entity";
import { InMemoryReviewsRepository } from "../repositories/in-memory-reviews.repository";
import { DeleteReviewUseCase } from "./delete-review.usecase";

describe("DeleteReviewUseCase", () => {
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: DeleteReviewUseCase;

	beforeEach(() => {
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new DeleteReviewUseCase(reviewsRepository);
	});

	function seedReview(userId: string) {
		reviewsRepository.items.push(
			new ReviewEntity({
				id: "review-1",
				userId,
				carVersionId: "v1",
				title: "Title",
				content: "Content",
				pros: null,
				cons: null,
				ownershipTimeMonths: null,
				kmDriven: null,
				score: 4,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		);
	}

	function makeUser(id: string, roles: RoleEntity[] = []) {
		return new UserEntity({ id, roles });
	}

	it("should delete when user is the author", async () => {
		seedReview("user-1");

		await sut.execute(makeUser("user-1"), "review-1");

		expect(reviewsRepository.items).toHaveLength(0);
	});

	it("should delete when user is ADMIN even if not author", async () => {
		seedReview("someone-else");
		const admin = makeUser("admin", [
			new RoleEntity({ id: "r1", type: "ADMIN" }),
		]);

		await sut.execute(admin, "review-1");

		expect(reviewsRepository.items).toHaveLength(0);
	});

	it("should throw BadRequestError when review not found", async () => {
		await expect(sut.execute(makeUser("user-1"), "unknown")).rejects.toThrow(
			"Review not found",
		);
	});

	it("should throw BadRequestError when non-owner non-admin tries to delete", async () => {
		seedReview("owner");

		await expect(sut.execute(makeUser("stranger"), "review-1")).rejects.toThrow(
			BadRequestError,
		);
		await expect(sut.execute(makeUser("stranger"), "review-1")).rejects.toThrow(
			"You can only delete your own reviews",
		);
	});
});
