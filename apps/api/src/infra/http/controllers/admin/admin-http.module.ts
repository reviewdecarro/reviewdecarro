import { Module } from "@nestjs/common";
import {
	AdminDeleteForumTopicUseCase,
	AdminGetForumTopicUseCase,
	AdminListForumTopicsUseCase,
} from "src/application/admin/use-cases/admin-forum.usecase";
import {
	AdminDeleteReviewUseCase,
	AdminGetReviewUseCase,
	AdminListReviewsUseCase,
} from "src/application/admin/use-cases/admin-reviews.usecase";
import { AdminSummaryUseCase } from "src/application/admin/use-cases/admin-summary.usecase";
import {
	AdminDeleteUserUseCase,
	AdminGetUserUseCase,
	AdminListUsersUseCase,
} from "src/application/admin/use-cases/admin-users.usecase";
import { DeleteForumTopicUseCase } from "src/application/forum/use-cases/delete-forum-topic.usecase";
import { DeleteReviewUseCase } from "src/application/reviews/use-cases/delete-review.usecase";
import { DeleteAccountUseCase } from "src/application/users/use-cases/delete-account.usecase";
import { DatabaseModule } from "src/infra/database/database.module";
import { SearchModule } from "src/infra/search/search.module";
import { AdminController } from "./admin.controller";

@Module({
	imports: [DatabaseModule, SearchModule],
	controllers: [AdminController],
	providers: [
		AdminSummaryUseCase,
		AdminListUsersUseCase,
		AdminGetUserUseCase,
		AdminDeleteUserUseCase,
		AdminListReviewsUseCase,
		AdminGetReviewUseCase,
		AdminDeleteReviewUseCase,
		AdminListForumTopicsUseCase,
		AdminGetForumTopicUseCase,
		AdminDeleteForumTopicUseCase,
		DeleteAccountUseCase,
		DeleteReviewUseCase,
		DeleteForumTopicUseCase,
	],
})
export class AdminHttpModule {}
