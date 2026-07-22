import { beforeEach, describe, expect, it } from "@jest/globals";
import {
	ForumTopicStatus,
	ReviewStatus,
} from "../../../../prisma/generated/enums";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumPostEntity } from "../../forum/entities/forum-post.entity";
import { ForumTopicEntity } from "../../forum/entities/forum-topic.entity";
import { InMemoryForumPostsRepository } from "../../forum/repositories/in-memory-forum-posts.repository";
import { InMemoryForumTopicsRepository } from "../../forum/repositories/in-memory-forum-topics.repository";
import { DeleteForumTopicUseCase } from "../../forum/use-cases/delete-forum-topic.usecase";
import { ReviewEntity } from "../../reviews/entities/review.entity";
import { InMemoryReviewsRepository } from "../../reviews/repositories/in-memory-reviews.repository";
import { DeleteReviewUseCase } from "../../reviews/use-cases/delete-review.usecase";
import { RoleEntity } from "../../roles/entities/role.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { InMemoryUsersRepository } from "../../users/repositories/in-memory-users.repository";
import { DeleteAccountUseCase } from "../../users/use-cases/delete-account.usecase";
import {
	AdminDeleteForumTopicUseCase,
	AdminGetForumTopicUseCase,
	AdminListForumTopicsUseCase,
} from "./admin-forum.usecase";
import {
	AdminDeleteReviewUseCase,
	AdminGetReviewUseCase,
	AdminListReviewsUseCase,
} from "./admin-reviews.usecase";
import { AdminSummaryUseCase } from "./admin-summary.usecase";
import {
	AdminDeleteUserUseCase,
	AdminGetUserUseCase,
	AdminListUsersUseCase,
} from "./admin-users.usecase";

describe("Admin use cases", () => {
	let usersRepository: InMemoryUsersRepository;
	let reviewsRepository: InMemoryReviewsRepository;
	let forumTopicsRepository: InMemoryForumTopicsRepository;
	let forumPostsRepository: InMemoryForumPostsRepository;
	let admin: UserEntity;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		reviewsRepository = new InMemoryReviewsRepository();
		forumTopicsRepository = new InMemoryForumTopicsRepository();
		forumPostsRepository = new InMemoryForumPostsRepository();
		admin = makeUser({
			id: "admin",
			username: "admin",
			roles: [new RoleEntity({ id: "role-admin", name: "admin" })],
		});
	});

	it("summarizes active users, published reviews and published forum topics", async () => {
		usersRepository.items.push(
			makeUser({ id: "u1", active: true }),
			makeUser({ id: "u2", active: false }),
		);
		reviewsRepository.items.push(
			makeReview({ id: "r1", status: ReviewStatus.PUBLISHED }),
			makeReview({ id: "r2", status: ReviewStatus.HIDDEN }),
		);
		forumTopicsRepository.items.push(
			makeTopic({ id: "t1", status: ForumTopicStatus.PUBLISHED }),
			makeTopic({
				id: "t2",
				status: ForumTopicStatus.DELETED,
				deletedAt: new Date(),
			}),
		);

		const sut = new AdminSummaryUseCase(
			usersRepository,
			reviewsRepository,
			forumTopicsRepository,
		);

		await expect(sut.execute()).resolves.toEqual({
			usersCount: 1,
			reviewsCount: 1,
			forumTopicsCount: 1,
		});
	});

	it("lists users with username search and pagination", async () => {
		usersRepository.items.push(
			makeUser({ id: "u1", username: "alice" }),
			makeUser({ id: "u2", username: "alex" }),
			makeUser({ id: "u3", username: "bob" }),
		);

		const sut = new AdminListUsersUseCase(usersRepository);
		const result = await sut.execute({ q: "al", page: 1, limit: 1 });

		expect(result.users).toEqual([expect.objectContaining({ username: "alice" })]);
		expect(result.meta).toEqual({
			page: 1,
			limit: 1,
			total: 2,
			totalPages: 2,
		});
	});

	it("returns user detail with review and forum topic metrics", async () => {
		usersRepository.items.push(makeUser({ id: "u1" }));
		reviewsRepository.items.push(makeReview({ id: "r1", userId: "u1" }));
		forumTopicsRepository.items.push(makeTopic({ id: "t1", authorId: "u1" }));

		const sut = new AdminGetUserUseCase(
			usersRepository,
			reviewsRepository,
			forumTopicsRepository,
		);

		await expect(sut.execute("u1")).resolves.toEqual(
			expect.objectContaining({
				id: "u1",
				metrics: {
					reviewsCount: 1,
					forumTopicsCount: 1,
				},
			}),
		);
	});

	it("blocks admin self deletion", async () => {
		const sut = new AdminDeleteUserUseCase(
			new DeleteAccountUseCase(usersRepository),
		);

		await expect(sut.execute("admin", "admin")).rejects.toThrow(
			BadRequestError,
		);
	});

	it("deletes another user through the account deletion flow", async () => {
		usersRepository.items.push(makeUser({ id: "u1" }));
		const sut = new AdminDeleteUserUseCase(
			new DeleteAccountUseCase(usersRepository),
		);

		await sut.execute("admin", "u1");

		expect(usersRepository.items).toHaveLength(0);
	});

	it("lists reviews with search, pagination and public slug data", async () => {
		reviewsRepository.items.push(
			makeReview({ id: "r1", title: "Honda Civic", slug: "honda-civic" }),
			makeReview({
				id: "r2",
				title: "Toyota Corolla",
				slug: "toyota-corolla",
				carVersionYear: makeVehicleYear({
					brand: "Toyota",
					model: "Corolla",
					version: "XEI",
				}),
			}),
		);

		const sut = new AdminListReviewsUseCase(reviewsRepository);
		const result = await sut.execute({ q: "civic", page: 1, limit: 10 });

		expect(result.reviews).toEqual([
			expect.objectContaining({
				id: "r1",
				slug: "honda-civic",
				title: "Honda Civic",
			}),
		]);
	});

	it("returns review detail and allows admin deletion", async () => {
		reviewsRepository.items.push(makeReview({ id: "r1", userId: "owner" }));

		const getSut = new AdminGetReviewUseCase(reviewsRepository);
		await expect(getSut.execute("r1")).resolves.toEqual(
			expect.objectContaining({
				id: "r1",
				metrics: { commentsCount: 0 },
			}),
		);

		const deleteSut = new AdminDeleteReviewUseCase(
			new DeleteReviewUseCase(reviewsRepository),
		);
		await deleteSut.execute(admin, "r1");

		expect(reviewsRepository.items).toHaveLength(0);
	});

	it("lists forum topics with search and excludes deleted topics", async () => {
		forumTopicsRepository.items.push(
			makeTopic({ id: "t1", title: "Civic maintenance", slug: "civic" }),
			makeTopic({
				id: "t2",
				title: "Deleted Civic",
				status: ForumTopicStatus.DELETED,
				deletedAt: new Date(),
			}),
		);

		const sut = new AdminListForumTopicsUseCase(forumTopicsRepository);
		const result = await sut.execute({ q: "civic", page: 1, limit: 10 });

		expect(result.topics).toEqual([
			expect.objectContaining({
				id: "t1",
				slug: "civic",
			}),
		]);
	});

	it("returns forum topic detail with recent posts and allows admin deletion", async () => {
		forumTopicsRepository.items.push(makeTopic({ id: "t1" }));
		forumPostsRepository.items.push(
			new ForumPostEntity({
				id: "p1",
				topicId: "t1",
				authorId: "u1",
				content: "Resposta",
				status: "PUBLISHED" as never,
				upvotes: 0,
				downvotes: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			}),
		);

		const getSut = new AdminGetForumTopicUseCase(
			forumTopicsRepository,
			forumPostsRepository,
		);
		await expect(getSut.execute("t1")).resolves.toEqual(
			expect.objectContaining({
				id: "t1",
				recentPosts: [expect.objectContaining({ id: "p1" })],
				metrics: {
					postsCount: 0,
					upvotes: 0,
					downvotes: 0,
				},
			}),
		);

		const deleteSut = new AdminDeleteForumTopicUseCase(
			new DeleteForumTopicUseCase(forumTopicsRepository),
		);
		await deleteSut.execute(admin, "t1");

		expect(forumTopicsRepository.items[0]?.status).toBe(ForumTopicStatus.DELETED);
	});
});

function makeUser(overrides: Partial<UserEntity> = {}): UserEntity {
	return new UserEntity({
		id: overrides.id ?? "user-1",
		username: overrides.username ?? "johndoe",
		email: overrides.email ?? "john@email.com",
		passwordHash: "hashed",
		active: overrides.active ?? true,
		confirmedEmail: overrides.confirmedEmail ?? true,
		createdAt: overrides.createdAt ?? new Date(),
		roles: overrides.roles,
	});
}

function makeReview(overrides: Partial<ReviewEntity> = {}): ReviewEntity {
	return new ReviewEntity({
		id: overrides.id ?? "review-1",
		userId: overrides.userId ?? "user-1",
		user: overrides.user ?? { id: overrides.userId ?? "user-1", username: "john" },
		carVersionYearId: overrides.carVersionYearId ?? "year-1",
		carVersionYear: overrides.carVersionYear ?? makeVehicleYear(),
		title: overrides.title ?? "Review",
		slug: overrides.slug ?? "review",
		content: overrides.content ?? "Content",
		pros: null,
		cons: null,
		ownershipTimeMonths: null,
		kmDriven: null,
		score: overrides.score ?? 4,
		status: overrides.status ?? ReviewStatus.PUBLISHED,
		commentsCount: overrides.commentsCount ?? 0,
		createdAt: overrides.createdAt ?? new Date(),
		updatedAt: overrides.updatedAt ?? new Date(),
	});
}

function makeVehicleYear(
	overrides: { brand?: string; model?: string; version?: string; year?: number } = {},
) {
	const brand = overrides.brand ?? "Honda";
	const model = overrides.model ?? "Civic";
	const version = overrides.version ?? "EXL";

	return {
		id: "year-1",
		year: overrides.year ?? 2020,
		carVersion: {
			id: "version-1",
			versionName: version,
			slug: version.toLowerCase(),
			model: {
				id: "model-1",
				name: model,
				slug: model.toLowerCase(),
				brand: {
					id: "brand-1",
					name: brand,
					slug: brand.toLowerCase(),
				},
			},
		},
	};
}

function makeTopic(overrides: Partial<ForumTopicEntity> = {}): ForumTopicEntity {
	return new ForumTopicEntity({
		id: overrides.id ?? "topic-1",
		authorId: overrides.authorId ?? "user-1",
		author: overrides.author ?? { id: overrides.authorId ?? "user-1", username: "john" },
		title: overrides.title ?? "Topic",
		slug: overrides.slug ?? "topic",
		content: overrides.content ?? "Content",
		status: overrides.status ?? ForumTopicStatus.PUBLISHED,
		postsCount: overrides.postsCount ?? 0,
		upvotes: overrides.upvotes ?? 0,
		downvotes: overrides.downvotes ?? 0,
		createdAt: overrides.createdAt ?? new Date(),
		updatedAt: overrides.updatedAt ?? new Date(),
		deletedAt: overrides.deletedAt ?? null,
	});
}
