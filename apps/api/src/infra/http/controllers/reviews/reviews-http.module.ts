import { Module } from "@nestjs/common";
import { CreateReviewUseCase } from "src/domain/reviews/use-cases/create-review.usecase";
import { DeleteReviewUseCase } from "src/domain/reviews/use-cases/delete-review.usecase";
import { GetReviewUseCase } from "src/domain/reviews/use-cases/get-review.usecase";
import { ListReviewsUseCase } from "src/domain/reviews/use-cases/list-reviews.usecase";
import { UpdateReviewUseCase } from "src/domain/reviews/use-cases/update-review.usecase";
import { DatabaseModule } from "src/infra/database/database.module";
import { ReviewsController } from "./reviews.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [ReviewsController],
	providers: [
		CreateReviewUseCase,
		GetReviewUseCase,
		ListReviewsUseCase,
		UpdateReviewUseCase,
		DeleteReviewUseCase,
	],
})
export class ReviewsHttpModule {}
