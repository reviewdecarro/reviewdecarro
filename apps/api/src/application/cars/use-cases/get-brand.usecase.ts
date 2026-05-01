import { Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { BrandEntity } from "../entities/brand.entity";
import { toBrandWithModelsResponseDto } from "../mappers/brand.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";

@Injectable()
export class GetBrandUseCase {
	constructor(private brandsRepository: BrandsRepositoryProps) {}

	async execute(slug: string) {
		const brand = await this.brandsRepository.findBySlugWithModels(slug);

		if (!brand) {
			throw new NotFoundError("Brand not found");
		}

		return toBrandWithModelsResponseDto(new BrandEntity(brand));
	}
}
