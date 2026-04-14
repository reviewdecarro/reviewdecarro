import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { CreateBrandUseCase } from "../../domain/cars/use-cases/create-brand.usecase";
import { CreateModelUseCase } from "../../domain/cars/use-cases/create-model.usecase";
import { CreateVersionUseCase } from "../../domain/cars/use-cases/create-version.usecase";
import { ListBrandsUseCase } from "../../domain/cars/use-cases/list-brands.usecase";
import { ListModelsUseCase } from "../../domain/cars/use-cases/list-models.usecase";
import { ListVersionsUseCase } from "../../domain/cars/use-cases/list-versions.usecase";
import { CreateCommentUseCase } from "../../domain/comments/use-cases/create-comment.usecase";
import { DeleteCommentUseCase } from "../../domain/comments/use-cases/delete-comment.usecase";
import { ListCommentsUseCase } from "../../domain/comments/use-cases/list-comments.usecase";
import { CreateReviewUseCase } from "../../domain/reviews/use-cases/create-review.usecase";
import { DeleteReviewUseCase } from "../../domain/reviews/use-cases/delete-review.usecase";
import { GetReviewUseCase } from "../../domain/reviews/use-cases/get-review.usecase";
import { ListReviewsUseCase } from "../../domain/reviews/use-cases/list-reviews.usecase";
import { UpdateReviewUseCase } from "../../domain/reviews/use-cases/update-review.usecase";
import { AuthenticateUserUseCase } from "../../domain/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "../../domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "../../domain/users/use-cases/find-user-by-username.usecase";
import { DeleteVoteUseCase } from "../../domain/votes/use-cases/delete-vote.usecase";
import { UpsertVoteUseCase } from "../../domain/votes/use-cases/upsert-vote.usecase";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { DatabaseModule } from "../database/database.module";
import { BrandsController } from "./controllers/brands/brands.controller";
import { CommentsController } from "./controllers/comments/comments.controller";
import { ReviewsController } from "./controllers/reviews/reviews.controller";
import { UsersController } from "./controllers/users/users.controller";
import { VotesController } from "./controllers/votes/votes.controller";

@Module({
	imports: [DatabaseModule, AuthModule],
	controllers: [
		UsersController,
		BrandsController,
		ReviewsController,
		CommentsController,
		VotesController,
	],
	providers: [
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
		CreateUserUseCase,
		AuthenticateUserUseCase,
		FindUserByUsernameUseCase,
		CreateBrandUseCase,
		ListBrandsUseCase,
		CreateModelUseCase,
		ListModelsUseCase,
		CreateVersionUseCase,
		ListVersionsUseCase,
		CreateReviewUseCase,
		GetReviewUseCase,
		ListReviewsUseCase,
		UpdateReviewUseCase,
		DeleteReviewUseCase,
		CreateCommentUseCase,
		ListCommentsUseCase,
		DeleteCommentUseCase,
		UpsertVoteUseCase,
		DeleteVoteUseCase,
	],
})
export class HttpModule {}
