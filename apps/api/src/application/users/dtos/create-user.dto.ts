import { Expose } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

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

export class UserResponseDto {
	@Expose()
	id: string;

	@Expose()
	username: string;

	@Expose()
	email: string;

	@Expose()
	createdAt: Date;
}
