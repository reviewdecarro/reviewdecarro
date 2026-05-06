import { Module } from "@nestjs/common";
import { BrandsRepositoryProps } from "../../application/cars/repositories/brands.repository";
import { ModelsRepositoryProps } from "../../application/cars/repositories/models.repository";
import { VersionsRepositoryProps } from "../../application/cars/repositories/versions.repository";
import { CommentsRepositoryProps } from "../../application/comments/repositories/comments.repository";
import { ForumPostsRepositoryProps } from "../../application/forum/repositories/forum-posts.repository";
import { ForumTopicsRepositoryProps } from "../../application/forum/repositories/forum-topics.repository";
import { ForumVotesRepositoryProps } from "../../application/forum/repositories/forum-votes.repository";
import { ReviewsRepositoryProps } from "../../application/reviews/repositories/reviews.repository";
import { RolesRepositoryProps } from "../../application/roles/repositories/roles.repository";
import { SessionsRepositoryProps } from "../../application/sessions/repositories/sessions.repository";
import { UserTokensRepositoryProps } from "../../application/users/repositories/user-tokens.repository";
import { UsersRepositoryProps } from "../../application/users/repositories/users.repository";
import { VotesRepositoryProps } from "../../application/votes/repositories/votes.repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaBrandsRepository } from "./prisma/repositories/prisma-brands.repository";
import { PrismaCommentsRepository } from "./prisma/repositories/prisma-comments.repository";
import { PrismaForumPostsRepository } from "./prisma/repositories/prisma-forum-posts.repository";
import { PrismaForumTopicsRepository } from "./prisma/repositories/prisma-forum-topics.repository";
import { PrismaForumVotesRepository } from "./prisma/repositories/prisma-forum-votes.repository";
import { PrismaModelsRepository } from "./prisma/repositories/prisma-models.repository";
import { PrismaReviewsRepository } from "./prisma/repositories/prisma-reviews.repository";
import { PrismaRolesRepository } from "./prisma/repositories/prisma-roles.repository";
import { PrismaSessionsRepository } from "./prisma/repositories/prisma-sessions.repository";
import { PrismaUserTokensRepository } from "./prisma/repositories/prisma-user-tokens.repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users.repository";
import { PrismaVersionsRepository } from "./prisma/repositories/prisma-versions.repository";
import { PrismaVotesRepository } from "./prisma/repositories/prisma-votes.repository";

@Module({
	providers: [
		PrismaService,
		{
			provide: UsersRepositoryProps,
			useClass: PrismaUsersRepository,
		},
		{
			provide: BrandsRepositoryProps,
			useClass: PrismaBrandsRepository,
		},
		{
			provide: ModelsRepositoryProps,
			useClass: PrismaModelsRepository,
		},
		{
			provide: VersionsRepositoryProps,
			useClass: PrismaVersionsRepository,
		},
		{
			provide: ReviewsRepositoryProps,
			useClass: PrismaReviewsRepository,
		},
		{
			provide: CommentsRepositoryProps,
			useClass: PrismaCommentsRepository,
		},
		{
			provide: ForumTopicsRepositoryProps,
			useClass: PrismaForumTopicsRepository,
		},
		{
			provide: ForumPostsRepositoryProps,
			useClass: PrismaForumPostsRepository,
		},
		{
			provide: ForumVotesRepositoryProps,
			useClass: PrismaForumVotesRepository,
		},
		{
			provide: VotesRepositoryProps,
			useClass: PrismaVotesRepository,
		},
		{
			provide: UserTokensRepositoryProps,
			useClass: PrismaUserTokensRepository,
		},
		{
			provide: RolesRepositoryProps,
			useClass: PrismaRolesRepository,
		},
		{
			provide: SessionsRepositoryProps,
			useClass: PrismaSessionsRepository,
		},
	],
	exports: [
		PrismaService,
		UsersRepositoryProps,
		BrandsRepositoryProps,
		ModelsRepositoryProps,
		VersionsRepositoryProps,
		ReviewsRepositoryProps,
		CommentsRepositoryProps,
		ForumTopicsRepositoryProps,
		ForumPostsRepositoryProps,
		ForumVotesRepositoryProps,
		VotesRepositoryProps,
		UserTokensRepositoryProps,
		RolesRepositoryProps,
		SessionsRepositoryProps,
	],
})
export class DatabaseModule {}
