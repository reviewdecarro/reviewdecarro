import { Transform, Type } from "class-transformer";
import {
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export enum SearchType {
	ALL = "all",
	REVIEW = "review",
	TOPIC = "topic",
}

export enum SearchSort {
	RELEVANCE = "relevance",
	RECENT = "recent",
	POPULAR = "popular",
}

export class SearchQueryDto {
	@IsOptional()
	@Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
	@IsString()
	@MaxLength(120)
	q?: string;

	@IsOptional()
	@IsEnum(SearchType)
	type: SearchType = SearchType.ALL;

	@IsOptional()
	@IsEnum(SearchSort)
	sort: SearchSort = SearchSort.RELEVANCE;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	limit = 10;
}
