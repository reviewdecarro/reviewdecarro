import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, MinLength } from "class-validator";

export class ResetPasswordDto {
	@ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
	@IsUUID()
	readonly token: string;

	@ApiProperty({ example: "newpassword123", minLength: 8 })
	@IsString()
	@MinLength(8)
	readonly password: string;
}
