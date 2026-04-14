import { Module } from "@nestjs/common";
import { BrandsRepositoryProps } from "../../domain/cars/repositories/brands.repository";
import { ModelsRepositoryProps } from "../../domain/cars/repositories/models.repository";
import { VersionsRepositoryProps } from "../../domain/cars/repositories/versions.repository";
import { CommentsRepositoryProps } from "../../domain/comments/repositories/comments.repository";
import { ReviewsRepositoryProps } from "../../domain/reviews/repositories/reviews.repository";
import { UsersRepositoryProps } from "../../domain/users/repositories/users.repository";
import { VotesRepositoryProps } from "../../domain/votes/repositories/votes.repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaBrandsRepository } from "./prisma/repositories/prisma-brands.repository";
import { PrismaCommentsRepository } from "./prisma/repositories/prisma-comments.repository";
import { PrismaModelsRepository } from "./prisma/repositories/prisma-models.repository";
import { PrismaReviewsRepository } from "./prisma/repositories/prisma-reviews.repository";
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
			provide: VotesRepositoryProps,
			useClass: PrismaVotesRepository,
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
		VotesRepositoryProps,
	],
})
export class DatabaseModule {}
