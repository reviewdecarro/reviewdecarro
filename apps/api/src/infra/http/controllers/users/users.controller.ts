import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { CreateUserDto } from "src/application/users/dtos/create-user.dto";
import { LoginUserDto } from "src/application/users/dtos/login-user.dto";
import { AuthenticateUserUseCase } from "src/application/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "src/application/users/use-cases/create-user.usecase";
import { LoginUserResponse, RegisterUserResponse } from "./response.props";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(
		private createUserService: CreateUserUseCase,
		private authenticateUserService: AuthenticateUserUseCase,
	) {}

	@Post("register")
	@ApiOperation({ summary: "Registrar novo usuário" })
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

	@Post("login")
	@ApiOperation({ summary: "Autenticar usuário" })
	@ApiOkResponse({
		description: "Login realizado com sucesso",
		type: LoginUserResponse,
	})
	@ApiBadRequestResponse({ description: "E-mail ou senha inválidos" })
	async login(@Body() data: LoginUserDto, @Res() res: Response) {
		const token = await this.authenticateUserService.execute(data);

		return res.status(HttpStatus.OK).json({
			message: "Login realizado com sucesso.",
			...token,
		});
	}
}
