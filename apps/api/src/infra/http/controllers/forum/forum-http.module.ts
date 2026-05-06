import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/infra/database/database.module";
import { CreateForumPostUseCase } from "src/application/forum/use-cases/create-forum-post.usecase";
import { CreateForumTopicUseCase } from "src/application/forum/use-cases/create-forum-topic.usecase";
import { DeleteForumPostUseCase } from "src/application/forum/use-cases/delete-forum-post.usecase";
import { DeleteForumTopicUseCase } from "src/application/forum/use-cases/delete-forum-topic.usecase";
import { GetForumTopicBySlugUseCase } from "src/application/forum/use-cases/get-forum-topic-by-slug.usecase";
import { ListForumTopicsUseCase } from "src/application/forum/use-cases/list-forum-topics.usecase";
import { UpsertForumVoteUseCase } from "src/application/forum/use-cases/upsert-forum-vote.usecase";
import { ForumController } from "./forum.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [ForumController],
	providers: [
		CreateForumTopicUseCase,
		ListForumTopicsUseCase,
		GetForumTopicBySlugUseCase,
		CreateForumPostUseCase,
		UpsertForumVoteUseCase,
		DeleteForumTopicUseCase,
		DeleteForumPostUseCase,
	],
})
export class ForumHttpModule {}
