import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { CreateUserDto } from "src/application/users/dtos/create-user.dto";
import { LoginUserDto } from "src/application/users/dtos/login-user.dto";
import { AuthenticateUserUseCase } from "src/application/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "src/application/users/use-cases/create-user.usecase";

@Controller("users")
export class UsersController {
	constructor(
		private createUserService: CreateUserUseCase,
		private authenticateUserService: AuthenticateUserUseCase,
	) {}

	@Post("auth/register")
	async register(@Body() data: CreateUserDto, @Res() res: Response) {
		const user = await this.createUserService.execute(data);

		return res.status(HttpStatus.CREATED).json({
			message:
				"Usuário cadastrado com sucesso. Um e-mail de confirmação foi enviado.",
			user,
		});
	}

	@Post("auth/login")
	async login(@Body() data: LoginUserDto, @Res() res: Response) {
		const token = await this.authenticateUserService.execute(data);

		return res.status(HttpStatus.OK).json({
			message: "Login realizado com sucesso.",
			...token,
		});
	}
}
