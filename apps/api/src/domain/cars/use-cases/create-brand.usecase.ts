import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateBrandDto } from "../dtos/create-brand.dto";
import { BrandEntity } from "../entities/brand.entity";
import { toBrandResponseDto } from "../mappers/brand.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";

@Injectable()
export class CreateBrandUseCase {
	constructor(private brandsRepository: BrandsRepositoryProps) {}

	async execute(data: CreateBrandDto) {
		const exists = await this.brandsRepository.findBySlug(data.slug);

		if (exists) {
			throw new BadRequestError("Brand slug already exists");
		}

		const brand = await this.brandsRepository.create(data);

		return toBrandResponseDto(new BrandEntity(brand));
	}
}
