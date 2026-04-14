import { Injectable } from "@nestjs/common";
import { BrandEntity } from "../entities/brand.entity";
import { toBrandResponseDto } from "../mappers/brand.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";

@Injectable()
export class ListBrandsUseCase {
	constructor(private brandsRepository: BrandsRepositoryProps) {}

	async execute() {
		const brands = await this.brandsRepository.findAll();

		return brands.map((brand) => toBrandResponseDto(new BrandEntity(brand)));
	}
}
