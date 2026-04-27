import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Res,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { ConfirmEmailDto } from "src/domain/users/dtos/confirm-email.dto";
import { CreateUserDto } from "src/domain/users/dtos/create-user.dto";
import { ForgotPasswordDto } from "src/domain/users/dtos/forgot-password.dto";
import { ResetPasswordDto } from "src/domain/users/dtos/reset-password.dto";
import { ConfirmEmailUseCase } from "src/domain/users/use-cases/confirm-email.usecase";
import { CreateUserUseCase } from "src/domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "src/domain/users/use-cases/find-user-by-username.usecase";
import { ResetUserPasswordUseCase } from "src/domain/users/use-cases/reset-user-password.usecase";
import { SendForgotPasswordEmailUseCase } from "src/domain/users/use-cases/send-forgot-password-email.usecase";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { RegisterUserResponse, ShowProfileResponse } from "./response.props";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(
		private createUserService: CreateUserUseCase,
		private findUserByUsernameService: FindUserByUsernameUseCase,
		private confirmEmailService: ConfirmEmailUseCase,
		private sendForgotPasswordEmailService: SendForgotPasswordEmailUseCase,
		private resetUserPasswordService: ResetUserPasswordUseCase,
	) {}

	@Post("register")
	@IsPublic()
	@ApiOperation({ description: "Registrar novo usuário" })
	@ApiCreatedResponse({
		description: "Usuário cadastrado com sucesso",
		type: RegisterUserResponse,
	})
	@ApiBadRequestResponse({ description: "E-mail ou username já cadastrado" })
	async register(@Body() data: CreateUserDto, @Res() res: Response) {
		const user = await this.createUserService.execute(data);

		return res.status(HttpStatus.CREATED).json({
			message:
				"Usuário cadastrado com sucesso. Um e-mail de confirmação foi enviado.",
			user,
		});
	}

	@Post("confirm-email")
	@IsPublic()
	@ApiOperation({ description: "Confirmar e-mail do usuário" })
	@ApiOkResponse({ description: "E-mail confirmado com sucesso" })
	@ApiBadRequestResponse({ description: "Token inválido ou expirado" })
	async confirmEmail(@Body() data: ConfirmEmailDto, @Res() res: Response) {
		await this.confirmEmailService.execute(data);

		return res.status(HttpStatus.OK).json({
			message: "E-mail confirmado com sucesso.",
		});
	}

	@Post("forgot-password")
	@IsPublic()
	@ApiOperation({ description: "Solicitar redefinição de senha" })
	@ApiOkResponse({ description: "E-mail de redefinição enviado com sucesso" })
	@ApiNotFoundResponse({ description: "Usuário não encontrado" })
	async forgotPassword(@Body() data: ForgotPasswordDto, @Res() res: Response) {
		await this.sendForgotPasswordEmailService.execute(data);

		return res.status(HttpStatus.OK).json({
			message:
				"Se o e-mail estiver cadastrado, você receberá um link para redefinição.",
		});
	}

	@Post("reset-password")
	@IsPublic()
	@ApiOperation({ description: "Redefinir senha com token" })
	@ApiOkResponse({ description: "Senha redefinida com sucesso" })
	@ApiBadRequestResponse({ description: "Token expirado" })
	@ApiNotFoundResponse({ description: "Token ou usuário não encontrado" })
	async resetPassword(@Body() data: ResetPasswordDto, @Res() res: Response) {
		await this.resetUserPasswordService.execute(data);

		return res.status(HttpStatus.OK).json({
			message: "Senha redefinida com sucesso.",
		});
	}

	@Get(":username")
	@ApiOperation({ description: "Buscar usuário por username" })
	@ApiParam({ name: "username", example: "johndoe" })
	@ApiOkResponse({
		description: "Perfil encontrado com sucesso",
		type: ShowProfileResponse,
	})
	@ApiBadRequestResponse({ description: "Usuário não encontrado" })
	async findByUsername(
		@Param("username") username: string,
		@Res() res: Response,
	) {
		const user = await this.findUserByUsernameService.execute(username);

		return res.status(HttpStatus.OK).json({
			message: "Perfil encontrado com sucesso.",
			user,
		});
	}
}
