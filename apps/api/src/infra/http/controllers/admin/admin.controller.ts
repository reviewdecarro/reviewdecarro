import {
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Query,
	Res,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import type { AdminListQuery } from "src/application/admin/admin.types";
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
import { UserEntity } from "src/application/users/entities/user.entity";
import { Roles } from "src/infra/auth/decorators/roles.decorator";
import { LoggedInUser } from "src/shared/decorators/logged-in.decorator";

@ApiTags("Admin")
@ApiBearerAuth()
@Roles("admin")
@Controller("admin")
export class AdminController {
	constructor(
		private adminSummaryUseCase: AdminSummaryUseCase,
		private adminListUsersUseCase: AdminListUsersUseCase,
		private adminGetUserUseCase: AdminGetUserUseCase,
		private adminDeleteUserUseCase: AdminDeleteUserUseCase,
		private adminListReviewsUseCase: AdminListReviewsUseCase,
		private adminGetReviewUseCase: AdminGetReviewUseCase,
		private adminDeleteReviewUseCase: AdminDeleteReviewUseCase,
		private adminListForumTopicsUseCase: AdminListForumTopicsUseCase,
		private adminGetForumTopicUseCase: AdminGetForumTopicUseCase,
		private adminDeleteForumTopicUseCase: AdminDeleteForumTopicUseCase,
	) {}

	@Get("summary")
	@ApiOperation({ description: "Resumo administrativo" })
	@ApiOkResponse({ description: "Resumo carregado com sucesso" })
	async summary(@Res() res: Response) {
		const summary = await this.adminSummaryUseCase.execute();

		return res.status(HttpStatus.OK).json(summary);
	}

	@Get("users")
	@ApiOperation({ description: "Listar usuários para administração" })
	@ApiQuery({ name: "q", required: false })
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "limit", required: false })
	@ApiOkResponse({ description: "Usuários carregados com sucesso" })
	async listUsers(@Query() query: AdminListQuery, @Res() res: Response) {
		const result = await this.adminListUsersUseCase.execute(query);

		return res.status(HttpStatus.OK).json(result);
	}

	@Get("users/:id")
	@ApiOperation({ description: "Detalhar usuário para administração" })
	@ApiParam({ name: "id" })
	@ApiOkResponse({ description: "Usuário carregado com sucesso" })
	async getUser(@Param("id") id: string, @Res() res: Response) {
		const user = await this.adminGetUserUseCase.execute(id);

		return res.status(HttpStatus.OK).json(user);
	}

	@Delete("users/:id")
	@ApiOperation({ description: "Excluir usuário pela administração" })
	@ApiParam({ name: "id" })
	@ApiNoContentResponse({ description: "Usuário excluído com sucesso" })
	async deleteUser(
		@LoggedInUser() admin: UserEntity,
		@Param("id") id: string,
		@Res() res: Response,
	) {
		await this.adminDeleteUserUseCase.execute(admin.id, id);

		return res.status(HttpStatus.NO_CONTENT).send();
	}

	@Get("reviews")
	@ApiOperation({ description: "Listar avaliações para administração" })
	@ApiQuery({ name: "q", required: false })
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "limit", required: false })
	@ApiOkResponse({ description: "Avaliações carregadas com sucesso" })
	async listReviews(@Query() query: AdminListQuery, @Res() res: Response) {
		const result = await this.adminListReviewsUseCase.execute(query);

		return res.status(HttpStatus.OK).json(result);
	}

	@Get("reviews/:id")
	@ApiOperation({ description: "Detalhar avaliação para administração" })
	@ApiParam({ name: "id" })
	@ApiOkResponse({ description: "Avaliação carregada com sucesso" })
	async getReview(@Param("id") id: string, @Res() res: Response) {
		const review = await this.adminGetReviewUseCase.execute(id);

		return res.status(HttpStatus.OK).json(review);
	}

	@Delete("reviews/:id")
	@ApiOperation({ description: "Excluir avaliação pela administração" })
	@ApiParam({ name: "id" })
	@ApiNoContentResponse({ description: "Avaliação excluída com sucesso" })
	async deleteReview(
		@LoggedInUser() admin: UserEntity,
		@Param("id") id: string,
		@Res() res: Response,
	) {
		await this.adminDeleteReviewUseCase.execute(admin, id);

		return res.status(HttpStatus.NO_CONTENT).send();
	}

	@Get("forum/topics")
	@ApiOperation({ description: "Listar tópicos do fórum para administração" })
	@ApiQuery({ name: "q", required: false })
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "limit", required: false })
	@ApiOkResponse({ description: "Tópicos carregados com sucesso" })
	async listForumTopics(@Query() query: AdminListQuery, @Res() res: Response) {
		const result = await this.adminListForumTopicsUseCase.execute(query);

		return res.status(HttpStatus.OK).json(result);
	}

	@Get("forum/topics/:id")
	@ApiOperation({ description: "Detalhar tópico do fórum para administração" })
	@ApiParam({ name: "id" })
	@ApiOkResponse({ description: "Tópico carregado com sucesso" })
	async getForumTopic(@Param("id") id: string, @Res() res: Response) {
		const topic = await this.adminGetForumTopicUseCase.execute(id);

		return res.status(HttpStatus.OK).json(topic);
	}

	@Delete("forum/topics/:id")
	@ApiOperation({ description: "Excluir tópico do fórum pela administração" })
	@ApiParam({ name: "id" })
	@ApiNoContentResponse({ description: "Tópico excluído com sucesso" })
	async deleteForumTopic(
		@LoggedInUser() admin: UserEntity,
		@Param("id") id: string,
		@Res() res: Response,
	) {
		await this.adminDeleteForumTopicUseCase.execute(admin, id);

		return res.status(HttpStatus.NO_CONTENT).send();
	}
}
