import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { LoginDto } from "src/application/sessions/dtos/login.dto";
import { RefreshDto } from "src/application/sessions/dtos/refresh.dto";
import { LoginUseCase } from "src/application/sessions/use-cases/login.usecase";
import { RefreshSessionUseCase } from "src/application/sessions/use-cases/refresh-session.usecase";
import { RevokeSessionUseCase } from "src/application/sessions/use-cases/revoke-session.usecase";
import { IsPublic } from "src/shared/decorators/is-public.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private loginService: LoginUseCase,
		private refreshSessionService: RefreshSessionUseCase,
		private revokeSessionService: RevokeSessionUseCase,
	) {}

	@Post("login")
	@IsPublic()
	@ApiOperation({ description: "Autenticar usuário e iniciar sessão" })
	@ApiOkResponse({ description: "Login realizado com sucesso" })
	@ApiBadRequestResponse({ description: "E-mail ou senha inválidos" })
	async login(
		@Body() data: LoginDto,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const result = await this.loginService.execute(data, {
			userAgent: req.headers["user-agent"],
			ipAddress: req.ip,
		});

		return res.status(HttpStatus.OK).json({
			message: "Login realizado com sucesso.",
			...result,
		});
	}

	@Post("refresh")
	@IsPublic()
	@ApiOperation({ description: "Renovar access token via refresh token" })
	@ApiOkResponse({ description: "Token renovado com sucesso" })
	@ApiUnauthorizedResponse({
		description: "Sessão inválida, revogada ou expirada",
	})
	async refresh(@Body() data: RefreshDto, @Res() res: Response) {
		const result = await this.refreshSessionService.execute(data);

		return res.status(HttpStatus.OK).json({
			message: "Token renovado com sucesso.",
			...result,
		});
	}

	@Post("logout")
	@ApiOperation({ description: "Encerrar sessão (revogar refresh token)" })
	@ApiOkResponse({ description: "Sessão encerrada com sucesso" })
	@ApiUnauthorizedResponse({ description: "Sessão inválida" })
	async logout(@Body() data: RefreshDto, @Res() res: Response) {
		await this.revokeSessionService.execute(data);

		return res.status(HttpStatus.OK).json({
			message: "Sessão encerrada com sucesso.",
		});
	}
}
