import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateVersionDto {
	@ApiProperty({ example: 2024 })
	@IsInt()
	@Min(1900)
	readonly year: number;

	@ApiProperty({ example: "Polo Track 1.0" })
	@IsString()
	@MinLength(1)
	readonly versionName: string;

	@ApiPropertyOptional({ example: "1.0 MPI" })
	@IsString()
	@IsOptional()
	readonly engine?: string;

	@ApiPropertyOptional({ example: "Manual 5 marchas" })
	@IsString()
	@IsOptional()
	readonly transmission?: string;

	@ApiProperty({ example: "polo-track-1-0-2024" })
	@IsString()
	@MinLength(1)
	readonly slug: string;
}

export class VersionResponseDto {
	@ApiProperty({ example: "uuid-123" })
	@Expose()
	id: string;

	@ApiProperty({ example: "uuid-model" })
	@Expose()
	modelId: string;

	@ApiProperty({ example: 2024 })
	@Expose()
	year: number;

	@ApiProperty({ example: "Polo Track 1.0" })
	@Expose()
	versionName: string;

	@ApiPropertyOptional({ example: "1.0 MPI" })
	@Expose()
	engine: string | null;

	@ApiPropertyOptional({ example: "Manual 5 marchas" })
	@Expose()
	transmission: string | null;

	@ApiProperty({ example: "polo-track-1-0-2024" })
	@Expose()
	slug: string;

	@ApiProperty({ example: "2026-01-01T00:00:00.000Z" })
	@Expose()
	createdAt: Date;
}
