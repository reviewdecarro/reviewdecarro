import { plainToInstance } from "class-transformer";
import { VersionResponseDto } from "../dtos/create-version.dto";
import { CarVersionEntity } from "../entities/car-version.entity";

export function toVersionResponseDto(
	version: CarVersionEntity,
): VersionResponseDto {
	return plainToInstance(VersionResponseDto, version, {
		excludeExtraneousValues: true,
	});
}
