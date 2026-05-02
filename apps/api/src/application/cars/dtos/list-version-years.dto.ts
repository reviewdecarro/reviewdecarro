import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class VersionYearItemDto {
	@ApiProperty({ example: 2024 })
	@Expose()
	year: number;
}

export class ListVersionYearsResponseDto {
	@ApiProperty({ type: () => VersionYearItemDto, isArray: true })
	@Expose()
	years: VersionYearItemDto[];
}
