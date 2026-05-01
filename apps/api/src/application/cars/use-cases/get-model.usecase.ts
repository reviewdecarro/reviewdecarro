import { Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { CarModelEntity } from "../entities/car-model.entity";
import { toModelWithVersionsResponseDto } from "../mappers/model.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";

@Injectable()
export class GetModelUseCase {
	constructor(
		private brandsRepository: BrandsRepositoryProps,
		private modelsRepository: ModelsRepositoryProps,
	) {}

	async execute(brandSlug: string, modelSlug: string) {
		const brand = await this.brandsRepository.findBySlug(brandSlug);

		if (!brand) {
			throw new NotFoundError("Brand not found");
		}

		const model = await this.modelsRepository.findByBrandIdAndSlugWithVersions(
			brand.id,
			modelSlug,
		);

		if (!model) {
			throw new NotFoundError("Model not found");
		}

		return toModelWithVersionsResponseDto(new CarModelEntity(model));
	}
}
