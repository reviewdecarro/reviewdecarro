import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import {
	CreateReviewDto,
	UpdateReviewDto,
} from "src/domain/reviews/dtos/create-review.dto";
import { CreateReviewUseCase } from "src/domain/reviews/use-cases/create-review.usecase";
import { DeleteReviewUseCase } from "src/domain/reviews/use-cases/delete-review.usecase";
import { GetReviewUseCase } from "src/domain/reviews/use-cases/get-review.usecase";
import { ListReviewsUseCase } from "src/domain/reviews/use-cases/list-reviews.usecase";
import { UpdateReviewUseCase } from "src/domain/reviews/use-cases/update-review.usecase";
import { UserEntity } from "src/domain/users/entities/user.entity";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { LoggedInUser } from "src/shared/decorators/logged-in.decorator";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
	constructor(
		private createReviewService: CreateReviewUseCase,
		private getReviewService: GetReviewUseCase,
		private listReviewsService: ListReviewsUseCase,
		private updateReviewService: UpdateReviewUseCase,
		private deleteReviewService: DeleteReviewUseCase,
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar nova review" })
	@ApiCreatedResponse({ description: "Review criada com sucesso" })
	@ApiBadRequestResponse({ description: "Versão não encontrada" })
	async create(
		@LoggedInUser() user: UserEntity,
		@Body() data: CreateReviewDto,
		@Res() res: Response,
	) {
		const review = await this.createReviewService.execute(user.id, data);

		return res.status(HttpStatus.CREATED).json({
			message: "Review criada com sucesso.",
			review,
		});
	}

	@Get()
	@IsPublic()
	@ApiOperation({ description: "Listar reviews com filtros" })
	@ApiQuery({ name: "carVersionId", required: false })
	@ApiQuery({ name: "username", required: false })
	@ApiQuery({ name: "q", required: false })
	@ApiOkResponse({ description: "Lista de reviews" })
	async list(
		@Query("carVersionId") carVersionId: string,
		@Query("username") userId: string,
		@Query("q") query: string,
		@Res() res: Response,
	) {
		const reviews = await this.listReviewsService.execute({
			carVersionId,
			userId,
			query,
		});

		return res.status(HttpStatus.OK).json({ reviews });
	}

	@Get(":reviewId")
	@IsPublic()
	@ApiOperation({ description: "Detalhe de uma review" })
	@ApiParam({ name: "reviewId" })
	@ApiOkResponse({ description: "Review encontrada" })
	@ApiBadRequestResponse({ description: "Review não encontrada" })
	async findById(@Param("reviewId") reviewId: string, @Res() res: Response) {
		const review = await this.getReviewService.execute(reviewId);

		return res.status(HttpStatus.OK).json({ review });
	}

	@Patch(":reviewId")
	@ApiBearerAuth()
	@ApiOperation({ description: "Editar review (autor)" })
	@ApiParam({ name: "reviewId" })
	@ApiOkResponse({ description: "Review atualizada com sucesso" })
	@ApiBadRequestResponse({
		description: "Review não encontrada ou sem permissão",
	})
	async update(
		@LoggedInUser() user: UserEntity,
		@Param("reviewId") reviewId: string,
		@Body() data: UpdateReviewDto,
		@Res() res: Response,
	) {
		const review = await this.updateReviewService.execute(
			user.id,
			reviewId,
			data,
		);

		return res.status(HttpStatus.OK).json({
			message: "Review atualizada com sucesso.",
			review,
		});
	}

	@Delete(":reviewId")
	@ApiBearerAuth()
	@ApiOperation({ description: "Remover review (autor ou ADMIN)" })
	@ApiParam({ name: "reviewId" })
	@ApiOkResponse({ description: "Review removida com sucesso" })
	@ApiBadRequestResponse({
		description: "Review não encontrada ou sem permissão",
	})
	async delete(
		@LoggedInUser() user: UserEntity,
		@Param("reviewId") reviewId: string,
		@Res() res: Response,
	) {
		await this.deleteReviewService.execute(user, reviewId);

		return res.status(HttpStatus.OK).json({
			message: "Review removida com sucesso.",
		});
	}
}
