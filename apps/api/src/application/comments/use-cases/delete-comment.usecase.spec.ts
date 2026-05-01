import { beforeEach, describe, expect, it } from "@jest/globals";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { RoleEntity } from "../../roles/entities/role.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { CommentEntity } from "../entities/comment.entity";
import { InMemoryCommentsRepository } from "../repositories/in-memory-comments.repository";
import { DeleteCommentUseCase } from "./delete-comment.usecase";

describe("DeleteCommentUseCase", () => {
	let commentsRepository: InMemoryCommentsRepository;
	let sut: DeleteCommentUseCase;

	beforeEach(() => {
		commentsRepository = new InMemoryCommentsRepository();
		sut = new DeleteCommentUseCase(commentsRepository);
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

	function makeUser(id: string, roles: RoleEntity[] = []) {
		return new UserEntity({ id, roles });
	}

	it("should delete when user is the author", async () => {
		seedComment("user-1");

		await sut.execute(makeUser("user-1"), "review-1", "comment-1");

		expect(commentsRepository.items).toHaveLength(0);
	});

	it("should delete when user is ADMIN even if not author", async () => {
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
	});

	it("should throw BadRequestError when comment not found", async () => {
		await expect(
			sut.execute(makeUser("user-1"), "review-1", "unknown"),
		).rejects.toThrow("Comment not found");
	});

	it("should throw BadRequestError when comment belongs to a different review", async () => {
		seedComment("user-1", "different-review");

		await expect(
			sut.execute(makeUser("user-1"), "review-1", "comment-1"),
		).rejects.toThrow("Comment not found");
	});

	it("should throw BadRequestError when non-owner non-admin tries to delete", async () => {
		seedComment("owner");

		await expect(
			sut.execute(makeUser("stranger"), "review-1", "comment-1"),
		).rejects.toThrow(BadRequestError);
		await expect(
			sut.execute(makeUser("stranger"), "review-1", "comment-1"),
		).rejects.toThrow("You can only delete your own comments");
	});
});
