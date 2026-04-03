import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto {
	@ApiProperty({ example: "john@email.com" })
	@IsEmail()
	readonly email: string;

	@ApiProperty({ example: "12345678", minLength: 8 })
	@IsString()
	@MinLength(8)
	readonly password: string;
}
