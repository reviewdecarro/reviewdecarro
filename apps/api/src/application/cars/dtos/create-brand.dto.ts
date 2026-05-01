import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { ModelResponseDto } from "./create-model.dto";

export class CreateBrandDto {
	@ApiProperty({ example: "Volkswagen" })
	@IsString()
	@MinLength(1)
	readonly name: string;

	@ApiProperty({ example: "volkswagen" })
	@IsString()
	@MinLength(1)
	readonly slug: string;
}

export class BrandResponseDto {
	@ApiProperty({ example: "uuid-123" })
	@Expose()
	id: string;

	@ApiProperty({ example: "Volkswagen" })
	@Expose()
	name: string;

	@ApiProperty({ example: "volkswagen" })
	@Expose()
	slug: string;

	@ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
	@Expose()
	createdAt: Date;
}

export class BrandWithModelsResponseDto {
	@ApiProperty({ example: "uuid-123" })
	@Expose()
	id: string;

	@ApiProperty({ example: "Volkswagen" })
	@Expose()
	name: string;

	@ApiProperty({ example: "volkswagen" })
	@Expose()
	slug: string;

	@ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
	@Expose()
	createdAt: Date;

	@ApiProperty({ type: () => ModelResponseDto, isArray: true })
	@Expose()
	@Type(() => ModelResponseDto)
	models: ModelResponseDto[];
}
