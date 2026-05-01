import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
	@ApiProperty({ example: "admin" })
	@IsString()
	@IsNotEmpty()
	readonly name: string;
}

export class RoleResponseDto {
	@ApiProperty({ example: "uuid-123" })
	@Expose()
	id: string;

	@ApiProperty({ example: "admin" })
	@Expose()
	name: string;

	@ApiProperty({ example: "2026-04-30T00:00:00.000Z" })
	@Expose()
	createdAt: Date;

	@ApiProperty({ example: "2026-04-30T00:00:00.000Z" })
	@Expose()
	updatedAt: Date;
}
