import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Res,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { CreateForumPostDto } from "src/application/forum/dtos/create-forum-post.dto";
import { CreateForumTopicDto } from "src/application/forum/dtos/create-forum-topic.dto";
import { UpsertForumVoteDto } from "src/application/forum/dtos/upsert-forum-vote.dto";
import { CreateForumPostUseCase } from "src/application/forum/use-cases/create-forum-post.usecase";
import { CreateForumTopicUseCase } from "src/application/forum/use-cases/create-forum-topic.usecase";
import { DeleteForumPostUseCase } from "src/application/forum/use-cases/delete-forum-post.usecase";
import { DeleteForumTopicUseCase } from "src/application/forum/use-cases/delete-forum-topic.usecase";
import { GetForumTopicBySlugUseCase } from "src/application/forum/use-cases/get-forum-topic-by-slug.usecase";
import { ListForumTopicsUseCase } from "src/application/forum/use-cases/list-forum-topics.usecase";
import { UpsertForumVoteUseCase } from "src/application/forum/use-cases/upsert-forum-vote.usecase";
import { UserEntity } from "src/application/users/entities/user.entity";
import { ForumVoteTargetType } from "../../../../../prisma/generated/enums";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { LoggedInUser } from "src/shared/decorators/logged-in.decorator";

@ApiTags("Forum")
@Controller("forum")
export class ForumController {
	constructor(
		private createForumTopicUseCase: CreateForumTopicUseCase,
		private listForumTopicsUseCase: ListForumTopicsUseCase,
		private getForumTopicBySlugUseCase: GetForumTopicBySlugUseCase,
		private createForumPostUseCase: CreateForumPostUseCase,
		private upsertForumVoteUseCase: UpsertForumVoteUseCase,
		private deleteForumTopicUseCase: DeleteForumTopicUseCase,
		private deleteForumPostUseCase: DeleteForumPostUseCase,
	) {}

	@Post("topics")
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar tópico no fórum" })
	@ApiCreatedResponse({ description: "Tópico criado com sucesso" })
	async createTopic(
		@LoggedInUser() user: UserEntity,
		@Body() data: CreateForumTopicDto,
		@Res() res: Response,
	) {
		const topic = await this.createForumTopicUseCase.execute(user.id, data);

		return res.status(HttpStatus.CREATED).json({
			message: "Tópico criado com sucesso.",
			topic,
		});
	}

	@Get("topics")
	@IsPublic()
	@ApiOperation({ description: "Listar tópicos do fórum" })
	@ApiOkResponse({ description: "Lista de tópicos" })
	async listTopics(@Res() res: Response) {
		const topics = await this.listForumTopicsUseCase.execute();

		return res.status(HttpStatus.OK).json({ topics });
	}

	@Get("topics/:slug")
	@IsPublic()
	@ApiOperation({ description: "Detalhar tópico por slug" })
	@ApiParam({ name: "slug" })
	@ApiOkResponse({ description: "Tópico encontrado" })
	@ApiBadRequestResponse({ description: "Tópico não encontrado" })
	async findTopicBySlug(@Param("slug") slug: string, @Res() res: Response) {
		const topic = await this.getForumTopicBySlugUseCase.execute(slug);

		return res.status(HttpStatus.OK).json({ topic });
	}

	@Post("topics/:topicId/posts")
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar resposta em um tópico" })
	@ApiParam({ name: "topicId" })
	@ApiCreatedResponse({ description: "Resposta criada com sucesso" })
	@ApiBadRequestResponse({ description: "Tópico não encontrado" })
	async createPost(
		@LoggedInUser() user: UserEntity,
		@Param("topicId") topicId: string,
		@Body() data: CreateForumPostDto,
		@Res() res: Response,
	) {
		const post = await this.createForumPostUseCase.execute(user.id, topicId, {
			content: data.content,
		});

		return res.status(HttpStatus.CREATED).json({
			message: "Resposta criada com sucesso.",
			post,
		});
	}

	@Post("topics/:topicId/posts/:postId/replies")
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar resposta em outra resposta" })
	@ApiParam({ name: "topicId" })
	@ApiParam({ name: "postId" })
	@ApiCreatedResponse({ description: "Resposta criada com sucesso" })
	@ApiBadRequestResponse({
		description: "Post não encontrado ou tópico inválido",
	})
	async createReply(
		@LoggedInUser() user: UserEntity,
		@Param("topicId") topicId: string,
		@Param("postId") postId: string,
		@Body() data: CreateForumPostDto,
		@Res() res: Response,
	) {
		const post = await this.createForumPostUseCase.execute(user.id, topicId, {
			content: data.content,
			parentPostId: postId,
		});

		return res.status(HttpStatus.CREATED).json({
			message: "Resposta criada com sucesso.",
			post,
		});
	}

	@Post("topics/:topicId/vote")
	@ApiBearerAuth()
	@ApiOperation({ description: "Votar em um tópico" })
	@ApiParam({ name: "topicId" })
	@ApiCreatedResponse({ description: "Voto registrado com sucesso" })
	async voteTopic(
		@LoggedInUser() user: UserEntity,
		@Param("topicId") topicId: string,
		@Body() data: UpsertForumVoteDto,
		@Res() res: Response,
	) {
		const result = await this.upsertForumVoteUseCase.execute(
			user.id,
			ForumVoteTargetType.TOPIC,
			topicId,
			data.value,
		);

		return res.status(HttpStatus.CREATED).json({
			message:
				result.action === "removed"
					? "Voto removido com sucesso."
					: "Voto registrado com sucesso.",
			action: result.action,
			vote: result.vote,
		});
	}

	@Post("posts/:postId/vote")
	@ApiBearerAuth()
	@ApiOperation({ description: "Votar em uma resposta" })
	@ApiParam({ name: "postId" })
	@ApiCreatedResponse({ description: "Voto registrado com sucesso" })
	async votePost(
		@LoggedInUser() user: UserEntity,
		@Param("postId") postId: string,
		@Body() data: UpsertForumVoteDto,
		@Res() res: Response,
	) {
		const result = await this.upsertForumVoteUseCase.execute(
			user.id,
			ForumVoteTargetType.POST,
			postId,
			data.value,
		);

		return res.status(HttpStatus.CREATED).json({
			message:
				result.action === "removed"
					? "Voto removido com sucesso."
					: "Voto registrado com sucesso.",
			action: result.action,
			vote: result.vote,
		});
	}

	@Delete("topics/:topicId")
	@ApiBearerAuth()
	@ApiOperation({ description: "Remover tópico (autor ou ADMIN)" })
	@ApiParam({ name: "topicId" })
	@ApiOkResponse({ description: "Tópico removido com sucesso" })
	async deleteTopic(
		@LoggedInUser() user: UserEntity,
		@Param("topicId") topicId: string,
		@Res() res: Response,
	) {
		await this.deleteForumTopicUseCase.execute(user, topicId);

		return res.status(HttpStatus.OK).json({
			message: "Tópico removido com sucesso.",
		});
	}

	@Delete("posts/:postId")
	@ApiBearerAuth()
	@ApiOperation({ description: "Remover resposta (autor ou ADMIN)" })
	@ApiParam({ name: "postId" })
	@ApiOkResponse({ description: "Resposta removida com sucesso" })
	async deletePost(
		@LoggedInUser() user: UserEntity,
		@Param("postId") postId: string,
		@Res() res: Response,
	) {
		await this.deleteForumPostUseCase.execute(user, postId);

		return res.status(HttpStatus.OK).json({
			message: "Resposta removida com sucesso.",
		});
	}
}
