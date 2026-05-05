import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from "@nestjs/common";
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
import { GetAuthenticatedUserUseCase } from "src/application/sessions/use-cases/get-authenticated-user.usecase";
import { LoginUseCase } from "src/application/sessions/use-cases/login.usecase";
import { RefreshSessionUseCase } from "src/application/sessions/use-cases/refresh-session.usecase";
import { RevokeSessionUseCase } from "src/application/sessions/use-cases/revoke-session.usecase";
import { UsersMapper } from "src/application/users/mappers/user.mapper";
import {
	authCookieNames,
	clearAuthCookies,
	parseCookieHeader,
	setAuthCookies,
} from "src/infra/auth/cookies";
import { IsPublic } from "src/shared/decorators/is-public.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(
		private loginService: LoginUseCase,
		private getAuthenticatedUserService: GetAuthenticatedUserUseCase,
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

		setAuthCookies(res, {
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
			sessionId: result.sessionId,
		});

		return res.status(HttpStatus.OK).json({
			message: "Login realizado com sucesso.",
			user: result.user,
		});
	}

	@Post("refresh")
	@IsPublic()
	@ApiOperation({ description: "Renovar access token via refresh token" })
	@ApiOkResponse({ description: "Token renovado com sucesso" })
	@ApiUnauthorizedResponse({
		description: "Sessão inválida, revogada ou expirada",
	})
	async refresh(
		@Body() data: Partial<RefreshDto>,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const cookies = parseCookieHeader(req.headers.cookie);
		const sessionId =
			data.sessionId ?? cookies[authCookieNames.sessionId] ?? "";
		const refreshToken =
			data.refreshToken ?? cookies[authCookieNames.refreshToken] ?? "";

		const result = await this.refreshSessionService.execute({
			sessionId,
			refreshToken,
		});
		setAuthCookies(res, {
			accessToken: result.accessToken,
			refreshToken: result.refreshToken,
			sessionId,
		});

		return res.status(HttpStatus.OK).json({
			message: "Token renovado com sucesso.",
		});
	}

	@Post("logout")
	@IsPublic()
	@ApiOperation({ description: "Encerrar sessão (revogar refresh token)" })
	@ApiOkResponse({ description: "Sessão encerrada com sucesso" })
	@ApiUnauthorizedResponse({ description: "Sessão inválida" })
	async logout(@Req() req: Request, @Res() res: Response) {
		const cookies = parseCookieHeader(req.headers.cookie);
		const sessionId = cookies[authCookieNames.sessionId];
		const refreshToken = cookies[authCookieNames.refreshToken];

		if (!sessionId || !refreshToken) {
			throw new UnauthorizedException();
		}

		await this.revokeSessionService.execute({ sessionId, refreshToken });
		clearAuthCookies(res);

		return res.status(HttpStatus.OK).json({
			message: "Sessão encerrada com sucesso.",
		});
	}

	@Get("me")
	@IsPublic()
	@ApiOperation({ description: "Obter usuário autenticado" })
	@ApiOkResponse({ description: "Usuário autenticado com sucesso" })
	async me(@Req() req: Request, @Res() res: Response) {
		const cookies = parseCookieHeader(req.headers.cookie);
		const user = await this.getAuthenticatedUserService.execute(
			cookies[authCookieNames.accessToken],
		);

		return res.status(HttpStatus.OK).json({
			message: user
				? "Usuário autenticado com sucesso."
				: "Nenhuma sessão autenticada.",
			user: user ? UsersMapper.toUserResponseDto(user) : null,
		});
	}
}
