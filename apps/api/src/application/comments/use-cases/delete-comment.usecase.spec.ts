import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { RoleEntity } from "../../roles/entities/role.entity";
import { ReviewEntity } from "../../reviews/entities/review.entity";
import { InMemoryReviewsRepository } from "../../reviews/repositories/in-memory-reviews.repository";
import { UserEntity } from "../../users/entities/user.entity";
import { CommentEntity } from "../entities/comment.entity";
import { InMemoryCommentsRepository } from "../repositories/in-memory-comments.repository";
import { DeleteCommentUseCase } from "./delete-comment.usecase";

describe("DeleteCommentUseCase", () => {
	let commentsRepository: InMemoryCommentsRepository;
	let reviewsRepository: InMemoryReviewsRepository;
	let sut: DeleteCommentUseCase;

	beforeEach(() => {
		commentsRepository = new InMemoryCommentsRepository();
		reviewsRepository = new InMemoryReviewsRepository();
		sut = new DeleteCommentUseCase(commentsRepository, reviewsRepository);
	});

	function seedComment(userId: string, reviewId = "review-1") {
		commentsRepository.items.push(
			new CommentEntity({
				id: "comment-1",
				reviewId,
				userId,
				content: "x",
				createdAt: new Date(),
			}),
		);
	}

	function seedReview(id = "review-1") {
		reviewsRepository.items.push(
			new ReviewEntity({
				id,
				userId: "author",
				carVersionId: "v1",
				commentsCount: 1,
				title: "t",
				content: "c",
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
		seedReview();
		seedComment("user-1");

		await sut.execute(makeUser("user-1"), "review-1", "comment-1");

		expect(commentsRepository.items).toHaveLength(0);
		expect(reviewsRepository.items[0]?.commentsCount).toBe(0);
	});

	it("should delete when user is ADMIN even if not author", async () => {
		seedReview();
		seedComment("someone-else");
		const admin = makeUser("admin", [
			new RoleEntity({
				id: "r1",
				name: "admin",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		]);

		await sut.execute(admin, "review-1", "comment-1");

		expect(commentsRepository.items).toHaveLength(0);
		expect(reviewsRepository.items[0]?.commentsCount).toBe(0);
	});

	it("should throw BadRequestError when comment not found", async () => {
		seedReview();
		await expect(
			sut.execute(makeUser("user-1"), "review-1", "unknown"),
		).rejects.toThrow("Comment not found");
	});

	it("should throw BadRequestError when comment belongs to a different review", async () => {
		seedReview();
		seedComment("user-1", "different-review");

		await expect(
			sut.execute(makeUser("user-1"), "review-1", "comment-1"),
		).rejects.toThrow("Comment not found");
	});

	it("should throw BadRequestError when non-owner non-admin tries to delete", async () => {
		seedReview();
		seedComment("owner");

		await expect(
			sut.execute(makeUser("stranger"), "review-1", "comment-1"),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute(makeUser("stranger"), "review-1", "comment-1"),
		).rejects.toThrow("You can only delete your own comments");
	});
});
