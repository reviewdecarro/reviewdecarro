import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty({ example: "johndoe", minLength: 3 })
	@IsString()
	@MinLength(3)
	readonly username: string;

	@ApiProperty({ example: "john@email.com" })
	@IsEmail()
	readonly email: string;

	@ApiProperty({ example: "12345678", minLength: 8 })
	@IsString()
	@MinLength(8)
	readonly password: string;
}

export class UserResponseDto {
	@ApiProperty({ example: "uuid-123" })
	@Expose()
	id: string;

	@ApiProperty({ example: "johndoe" })
	@Expose()
	username: string;

	@ApiProperty({ example: "john@email.com" })
	@Expose()
	email: string;

	@ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
	@Expose()
	createdAt: Date;

	@ApiProperty({ example: true })
	@Expose()
	active: boolean;
}
