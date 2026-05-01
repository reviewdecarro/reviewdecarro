import { Module } from "@nestjs/common";
import { CreateReviewUseCase } from "src/application/reviews/use-cases/create-review.usecase";
import { DeleteReviewUseCase } from "src/application/reviews/use-cases/delete-review.usecase";
import { GetReviewUseCase } from "src/application/reviews/use-cases/get-review.usecase";
import { GetReviewBySlugUseCase } from "src/application/reviews/use-cases/get-review-by-slug.usecase";
import { ListReviewsUseCase } from "src/application/reviews/use-cases/list-reviews.usecase";
import { UpdateReviewUseCase } from "src/application/reviews/use-cases/update-review.usecase";
import { DatabaseModule } from "src/infra/database/database.module";
import { ReviewsController } from "./reviews.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [ReviewsController],
	providers: [
		CreateReviewUseCase,
		GetReviewUseCase,
		GetReviewBySlugUseCase,
		ListReviewsUseCase,
		UpdateReviewUseCase,
		DeleteReviewUseCase,
	],
})
export class ReviewsHttpModule {}
