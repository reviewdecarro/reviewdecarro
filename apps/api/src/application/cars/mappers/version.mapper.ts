import { plainToInstance } from "class-transformer";
import { VersionResponseDto } from "../dtos/create-version.dto";
import { CarVersionEntity } from "../entities/car-version.entity";

export class VersionsMapper {
	static toVersionResponseDto(version: CarVersionEntity): VersionResponseDto {
		return plainToInstance(VersionResponseDto, version, {
			excludeExtraneousValues: true,
		});
	}
}
