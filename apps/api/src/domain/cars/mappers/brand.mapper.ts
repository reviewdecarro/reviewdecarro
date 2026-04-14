import { plainToInstance } from "class-transformer";
import { BrandResponseDto } from "../dtos/create-brand.dto";
import { BrandEntity } from "../entities/brand.entity";

export function toBrandResponseDto(brand: BrandEntity): BrandResponseDto {
	return plainToInstance(BrandResponseDto, brand, {
		excludeExtraneousValues: true,
	});
}
