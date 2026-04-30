import { plainToInstance } from "class-transformer";
import { BrandResponseDto, BrandWithModelsResponseDto } from "../dtos/create-brand.dto";
import { BrandEntity } from "../entities/brand.entity";

export class BrandsMapper {
	static toBrandResponseDto(brand: BrandEntity): BrandResponseDto {
		return plainToInstance(BrandResponseDto, brand, {
			excludeExtraneousValues: true,
		});
	}
}

export function toBrandWithModelsResponseDto(brand: BrandEntity): BrandWithModelsResponseDto {
	return plainToInstance(BrandWithModelsResponseDto, brand, {
		excludeExtraneousValues: true,
	});
}
