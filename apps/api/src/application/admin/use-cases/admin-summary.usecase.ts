import { Injectable } from "@nestjs/common";
import { ForumTopicsRepositoryProps } from "../../forum/repositories/forum-topics.repository";
import { ReviewsRepositoryProps } from "../../reviews/repositories/reviews.repository";
import { UsersRepositoryProps } from "../../users/repositories/users.repository";

@Injectable()
export class AdminSummaryUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private reviewsRepository: ReviewsRepositoryProps,
		private forumTopicsRepository: ForumTopicsRepositoryProps,
	) {}

	async execute() {
		const [usersCount, reviewsCount, forumTopicsCount] = await Promise.all([
			this.usersRepository.countActive(),
			this.reviewsRepository.countPublished(),
			this.forumTopicsRepository.countPublished(),
		]);

		return {
			usersCount,
			reviewsCount,
			forumTopicsCount,
		};
	}
}
