import {
	Body,
	Controller,
	Delete,
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
import { UserEntity } from "src/domain/users/entities/user.entity";
import { UpsertVoteDto } from "src/domain/votes/dtos/upsert-vote.dto";
import { DeleteVoteUseCase } from "src/domain/votes/use-cases/delete-vote.usecase";
import { UpsertVoteUseCase } from "src/domain/votes/use-cases/upsert-vote.usecase";
import { LoggedInUser } from "src/shared/decorators/logged-in.decorator";

@ApiTags("Votes")
@Controller("reviews/:reviewId/vote")
export class VotesController {
	constructor(
		private upsertVoteService: UpsertVoteUseCase,
		private deleteVoteService: DeleteVoteUseCase,
	) {}

	@Post()
	@ApiBearerAuth()
	@ApiOperation({ description: "Registrar ou atualizar voto" })
	@ApiParam({ name: "reviewId" })
	@ApiCreatedResponse({ description: "Voto registrado com sucesso" })
	@ApiBadRequestResponse({ description: "Review não encontrada" })
	async upsert(
		@LoggedInUser() user: UserEntity,
		@Param("reviewId") reviewId: string,
		@Body() data: UpsertVoteDto,
		@Res() res: Response,
	) {
		const vote = await this.upsertVoteService.execute(
			user.id,
			reviewId,
			data,
		);

		return res.status(HttpStatus.CREATED).json({
			message: "Voto registrado com sucesso.",
			vote,
		});
	}

	@Delete()
	@ApiBearerAuth()
	@ApiOperation({ description: "Remover voto" })
	@ApiParam({ name: "reviewId" })
	@ApiOkResponse({ description: "Voto removido com sucesso" })
	async delete(
		@LoggedInUser() user: UserEntity,
		@Param("reviewId") reviewId: string,
		@Res() res: Response,
	) {
		await this.deleteVoteService.execute(user.id, reviewId);

		return res.status(HttpStatus.OK).json({
			message: "Voto removido com sucesso.",
		});
	}
}
