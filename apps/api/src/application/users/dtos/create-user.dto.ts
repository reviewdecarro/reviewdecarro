import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@MinLength(3)
	readonly username: string;

	@IsEmail()
	readonly email: string;

	@IsString()
	@MinLength(8)
	readonly password: string;
}
