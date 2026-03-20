import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { CreateUserDto } from "../../../../application/users/dtos/create-user.dto";
import { CreateUserUseCase } from "../../../../application/users/use-cases/create-user.usecase";

@Controller("users")
export class UsersController {
	constructor(private createUserService: CreateUserUseCase) {}

	@Post()
	async createUser(@Body() data: CreateUserDto, @Res() res: Response) {
		const user = await this.createUserService.execute(data);

		return res.status(HttpStatus.CREATED).json({
			message:
				"Usuário cadastrado com sucesso. Um e-mail de confirmação foi enviado.",
			user,
		});
	}
}
