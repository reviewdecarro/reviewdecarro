import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	Min,
	MinLength,
	ValidateNested,
} from "class-validator";
import { RatingCategory } from "../../../../prisma/generated/enums";

export class RatingDto {
	@ApiProperty({ example: "COMFORT", enum: RatingCategory })
	@IsEnum(RatingCategory)
	readonly category: RatingCategory;

	@ApiProperty({ example: 4 })
	@IsInt()
	@Min(1)
	@Max(5)
	readonly value: number;
}

export class CreateReviewDto {
	@ApiPropertyOptional({ example: "uuid-car-version" })
	@IsUUID()
	@IsOptional()
	readonly carVersionYearId?: string;

	@ApiProperty({ example: "Excelente custo-benefício" })
	@IsString()
	@MinLength(3)
	readonly title: string;

	@ApiProperty({ example: "O carro é ótimo para o dia a dia..." })
	@IsString()
	@MinLength(10)
	readonly content: string;

	@ApiPropertyOptional({ example: "Econômico, bom espaço interno" })
	@IsString()
	@IsOptional()
	readonly pros?: string;

	@ApiPropertyOptional({ example: "Acabamento simples" })
	@IsString()
	@IsOptional()
	readonly cons?: string;

	@ApiPropertyOptional({ example: 12 })
	@IsInt()
	@Min(0)
	@IsOptional()
	readonly ownershipTimeMonths?: number;

	@ApiPropertyOptional({ example: 15000 })
	@IsInt()
	@Min(0)
	@IsOptional()
	readonly kmDriven?: number;

	@ApiProperty({ example: 4.5 })
	@IsNumber()
	@Min(0)
	@Max(5)
	readonly score: number;

	@ApiPropertyOptional({ type: [RatingDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RatingDto)
	@IsOptional()
	readonly ratings?: RatingDto[];
}

export class UpdateReviewDto {
	@ApiPropertyOptional({ example: "Título atualizado" })
	@IsString()
	@MinLength(3)
	@IsOptional()
	readonly title?: string;

	@ApiPropertyOptional({ example: "Conteúdo atualizado..." })
	@IsString()
	@MinLength(10)
	@IsOptional()
	readonly content?: string;

	@ApiPropertyOptional({ example: "Novos prós" })
	@IsString()
	@IsOptional()
	readonly pros?: string;

	@ApiPropertyOptional({ example: "Novos contras" })
	@IsString()
	@IsOptional()
	readonly cons?: string;

	@ApiPropertyOptional({ example: 24 })
	@IsInt()
	@Min(0)
	@IsOptional()
	readonly ownershipTimeMonths?: number;

	@ApiPropertyOptional({ example: 30000 })
	@IsInt()
	@Min(0)
	@IsOptional()
	readonly kmDriven?: number;

	@ApiPropertyOptional({ example: 4.0 })
	@IsNumber()
	@Min(0)
	@Max(5)
	@IsOptional()
	readonly score?: number;

	@ApiPropertyOptional({ type: [RatingDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RatingDto)
	@IsOptional()
	readonly ratings?: RatingDto[];
}

export class RatingResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	category: string;

	@ApiProperty()
	@Expose()
	value: number;
}

export class ReviewBrandResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	name: string;

	@ApiProperty()
	@Expose()
	slug: string;
}

export class ReviewModelResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	name: string;

	@ApiProperty()
	@Expose()
	slug: string;

	@ApiPropertyOptional({ type: () => ReviewBrandResponseDto })
	@Expose()
	@Type(() => ReviewBrandResponseDto)
	brand?: ReviewBrandResponseDto;
}

export class ReviewVersionResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	versionName: string;

	@ApiProperty()
	@Expose()
	slug: string;

	@ApiPropertyOptional({ type: () => ReviewModelResponseDto })
	@Expose()
	@Type(() => ReviewModelResponseDto)
	model?: ReviewModelResponseDto;
}

export class ReviewYearResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	year: number;

	@ApiPropertyOptional({ type: () => ReviewVersionResponseDto })
	@Expose()
	@Type(() => ReviewVersionResponseDto)
	carVersion?: ReviewVersionResponseDto;
}

export class ReviewAuthorResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	username: string;
}

export class ReviewResponseDto {
	@ApiProperty()
	@Expose()
	id: string;

	@ApiProperty()
	@Expose()
	userId: string;

	@ApiProperty()
	@Expose()
	carVersionYearId: string;

	@ApiPropertyOptional()
	@Expose()
	carVersionId?: string;

	@ApiProperty()
	@Expose()
	commentsCount: number;

	@ApiProperty()
	@Expose()
	title: string;

	@ApiProperty()
	@Expose()
	slug: string;

	@ApiProperty()
	@Expose()
	content: string;

	@ApiPropertyOptional()
	@Expose()
	pros: string | null;

	@ApiPropertyOptional()
	@Expose()
	cons: string | null;

	@ApiPropertyOptional()
	@Expose()
	ownershipTimeMonths: number | null;

	@ApiPropertyOptional()
	@Expose()
	kmDriven: number | null;

	@ApiProperty()
	@Expose()
	score: number;

	@ApiProperty()
	@Expose()
	createdAt: Date;

	@ApiProperty()
	@Expose()
	updatedAt: Date;

	@ApiPropertyOptional()
	@Expose()
	ratings: RatingResponseDto[];

	@ApiPropertyOptional({ type: () => ReviewAuthorResponseDto })
	@Expose()
	@Type(() => ReviewAuthorResponseDto)
	user?: ReviewAuthorResponseDto;

	@ApiPropertyOptional({ type: () => ReviewYearResponseDto })
	@Expose()
	@Type(() => ReviewYearResponseDto)
	carVersionYear?: ReviewYearResponseDto;
}
