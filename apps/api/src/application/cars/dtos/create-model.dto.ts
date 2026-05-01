import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { VersionResponseDto } from "./create-version.dto";

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

export class ModelWithVersionsResponseDto {
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

	@ApiProperty({ type: () => VersionResponseDto, isArray: true })
	@Expose()
	@Type(() => VersionResponseDto)
	carVersions: VersionResponseDto[];
}
