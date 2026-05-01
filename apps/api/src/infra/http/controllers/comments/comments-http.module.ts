import { Module } from "@nestjs/common";
import { CreateCommentUseCase } from "src/application/comments/use-cases/create-comment.usecase";
import { DeleteCommentUseCase } from "src/application/comments/use-cases/delete-comment.usecase";
import { ListCommentsUseCase } from "src/application/comments/use-cases/list-comments.usecase";
import { DatabaseModule } from "src/infra/database/database.module";
import { CommentsController } from "./comments.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [CommentsController],
	providers: [CreateCommentUseCase, ListCommentsUseCase, DeleteCommentUseCase],
})
export class CommentsHttpModule {}
