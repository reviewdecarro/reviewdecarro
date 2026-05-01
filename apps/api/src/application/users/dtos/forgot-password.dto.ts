import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
	@ApiProperty({ example: "john@email.com" })
	@IsEmail()
	readonly email: string;
}
