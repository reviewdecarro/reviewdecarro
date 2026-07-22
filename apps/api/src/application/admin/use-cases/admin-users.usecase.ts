import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { ForumTopicsRepositoryProps } from "../../forum/repositories/forum-topics.repository";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { DeleteAccountUseCase } from "../../users/use-cases/delete-account.usecase";
import { UsersRepositoryProps } from "../../users/repositories/users.repository";
import {
	type AdminListQuery,
	createPaginationMeta,
	mapAdminUser,
	normalizePagination,
} from "../admin.types";

@Injectable()
export class AdminListUsersUseCase {
	constructor(private usersRepository: UsersRepositoryProps) {}

	async execute(query: AdminListQuery) {
		const pagination = normalizePagination(query);
		const result = await this.usersRepository.findManyForAdmin({
			query: query.q,
			...pagination,
		});

		return {
			users: result.users.map(mapAdminUser),
			meta: createPaginationMeta(pagination, result.total),
		};
	}
}

@Injectable()
export class AdminGetUserUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private reviewsRepository: ReviewsRepositoryProps,
		private forumTopicsRepository: ForumTopicsRepositoryProps,
	) {}

	async execute(id: string) {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new BadRequestError("User not found");
		}

		const [reviewsCount, forumTopicsCount] = await Promise.all([
			this.reviewsRepository.countByUserId(id),
			this.forumTopicsRepository.countByAuthorId(id),
		]);

		return {
			...mapAdminUser(user),
			metrics: {
				reviewsCount,
				forumTopicsCount,
			},
		};
	}
}

@Injectable()
export class AdminDeleteUserUseCase {
	constructor(private deleteAccountUseCase: DeleteAccountUseCase) {}

	async execute(adminUserId: string, targetUserId: string): Promise<void> {
		if (adminUserId === targetUserId) {
			throw new BadRequestError("Admin users cannot delete themselves");
		}

		await this.deleteAccountUseCase.execute(targetUserId);
	}
}
