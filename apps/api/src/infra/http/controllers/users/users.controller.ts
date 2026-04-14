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
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { CreateUserDto } from "src/domain/users/dtos/create-user.dto";
import { LoginUserDto } from "src/domain/users/dtos/login-user.dto";
import { AuthenticateUserUseCase } from "src/domain/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "src/domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "src/domain/users/use-cases/find-user-by-username.usecase";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import {
	LoginUserResponse,
	RegisterUserResponse,
	ShowProfileResponse,
} from "./response.props";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(
		private createUserService: CreateUserUseCase,
		private authenticateUserService: AuthenticateUserUseCase,
		private findUserByUsernameService: FindUserByUsernameUseCase,
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

	@Post("login")
	@IsPublic()
	@ApiOperation({ description: "Autenticar usuário" })
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

	@Get(":username")
	// @IsPublic()
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
