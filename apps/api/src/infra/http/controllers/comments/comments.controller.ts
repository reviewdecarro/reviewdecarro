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
import { CreateCommentDto } from "src/domain/comments/dtos/create-comment.dto";
import { CreateCommentUseCase } from "src/domain/comments/use-cases/create-comment.usecase";
import { DeleteCommentUseCase } from "src/domain/comments/use-cases/delete-comment.usecase";
import { ListCommentsUseCase } from "src/domain/comments/use-cases/list-comments.usecase";
import { UserEntity } from "src/domain/users/entities/user.entity";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { LoggedInUser } from "src/shared/decorators/logged-in.decorator";

@ApiTags("Comments")
@Controller("reviews/:reviewId/comments")
export class CommentsController {
	constructor(
		private createCommentService: CreateCommentUseCase,
		private listCommentsService: ListCommentsUseCase,
		private deleteCommentService: DeleteCommentUseCase,
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar comentário em uma review" })
	@ApiParam({ name: "reviewId" })
	@ApiCreatedResponse({ description: "Comentário criado com sucesso" })
	@ApiBadRequestResponse({ description: "Review não encontrada" })
	async create(
		@LoggedInUser() user: UserEntity,
		@Param("reviewId") reviewId: string,
		@Body() data: CreateCommentDto,
		@Res() res: Response,
	) {
		const comment = await this.createCommentService.execute(
			reviewId,
			user.id,
			data,
		);

		return res.status(HttpStatus.CREATED).json({
			message: "Comentário criado com sucesso.",
			comment,
		});
	}

	@Get()
	@IsPublic()
	@ApiOperation({ description: "Listar comentários de uma review" })
	@ApiParam({ name: "reviewId" })
	@ApiOkResponse({ description: "Lista de comentários" })
	async list(
		@Param("reviewId") reviewId: string,
		@Res() res: Response,
	) {
		const comments = await this.listCommentsService.execute(reviewId);

		return res.status(HttpStatus.OK).json({ comments });
	}

	@Delete(":commentId")
	@ApiBearerAuth()
	@ApiOperation({ description: "Remover comentário (autor ou ADMIN)" })
	@ApiParam({ name: "reviewId" })
	@ApiParam({ name: "commentId" })
	@ApiOkResponse({ description: "Comentário removido com sucesso" })
	@ApiBadRequestResponse({ description: "Comentário não encontrado ou sem permissão" })
	async delete(
		@LoggedInUser() user: UserEntity,
		@Param("reviewId") reviewId: string,
		@Param("commentId") commentId: string,
		@Res() res: Response,
	) {
		await this.deleteCommentService.execute(user, reviewId, commentId);

		return res.status(HttpStatus.OK).json({
			message: "Comentário removido com sucesso.",
		});
	}
}
