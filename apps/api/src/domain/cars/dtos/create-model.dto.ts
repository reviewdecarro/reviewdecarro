import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateModelDto {
	@ApiProperty({ example: "Polo" })
	@IsString()
	@MinLength(1)
	readonly name: string;

	@ApiProperty({ example: "polo" })
	@IsString()
	@MinLength(1)
	readonly slug: string;
}

export class ModelResponseDto {
	@ApiProperty({ example: "uuid-123" })
	@Expose()
	id: string;

	@ApiProperty({ example: "Polo" })
	@Expose()
	name: string;

	@ApiProperty({ example: "polo" })
	@Expose()
	slug: string;

	@ApiProperty({ example: "uuid-brand" })
	@Expose()
	brandId: string;

	@ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
	@Expose()
	createdAt: Date;
}
