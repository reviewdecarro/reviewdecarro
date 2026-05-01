import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateModelDto } from "../dtos/create-model.dto";
import { CarModelEntity } from "../entities/car-model.entity";
import { ModelsMapper } from "../mappers/model.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";

@Injectable()
export class CreateModelUseCase {
	constructor(
		private brandsRepository: BrandsRepositoryProps,
		private modelsRepository: ModelsRepositoryProps,
	) {}

	async execute(brandSlug: string, data: CreateModelDto) {
		const brand = await this.brandsRepository.findBySlug(brandSlug);

		if (!brand) {
			throw new BadRequestError("Brand not found");
		}

		const exists = await this.modelsRepository.findByBrandIdAndSlug(
			brand.id,
			data.slug,
		);

		if (exists) {
			throw new BadRequestError("Model slug already exists for this brand");
		}

		const model = await this.modelsRepository.create(brand.id, data);

		return ModelsMapper.toModelResponseDto(new CarModelEntity(model));
	}
}
