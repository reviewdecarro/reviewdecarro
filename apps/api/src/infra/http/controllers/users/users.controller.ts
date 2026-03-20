import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../../../application/users/dtos/create-user.dto';
import { CreateUserUseCase } from '../../../../application/users/use-cases/create-user.usecase';

@Controller('users')
export class UsersController {
	constructor(private createUserService: CreateUserUseCase) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.createUserService.execute(createUserDto);
	}
}
