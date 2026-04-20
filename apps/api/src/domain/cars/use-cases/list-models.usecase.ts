import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CarModelEntity } from "../entities/car-model.entity";
import { ModelsMapper } from "../mappers/model.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";

@Injectable()
export class ListModelsUseCase {
	constructor(
		private brandsRepository: BrandsRepositoryProps,
		private modelsRepository: ModelsRepositoryProps,
	) {}

	async execute(brandSlug: string) {
		const brand = await this.brandsRepository.findBySlug(brandSlug);

		if (!brand) {
			throw new BadRequestError("Brand not found");
		}

		const models = await this.modelsRepository.findByBrandId(brand.id);

		return models.map((model) =>
			ModelsMapper.toModelResponseDto(new CarModelEntity(model)),
		);
	}
}
