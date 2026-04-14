import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CarVersionEntity } from "../entities/car-version.entity";
import { toVersionResponseDto } from "../mappers/version.mapper";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { VersionsRepositoryProps } from "../repositories/versions.repository";

@Injectable()
export class ListVersionsUseCase {
	constructor(
		private brandsRepository: BrandsRepositoryProps,
		private modelsRepository: ModelsRepositoryProps,
		private versionsRepository: VersionsRepositoryProps,
	) {}

	async execute(brandSlug: string, modelSlug: string) {
		const brand = await this.brandsRepository.findBySlug(brandSlug);

		if (!brand) {
			throw new BadRequestError("Brand not found");
		}

		const model = await this.modelsRepository.findByBrandIdAndSlug(
			brand.id,
			modelSlug,
		);

		if (!model) {
			throw new BadRequestError("Model not found");
		}

		const versions = await this.versionsRepository.findByModelId(model.id);

		return versions.map((v) => toVersionResponseDto(new CarVersionEntity(v)));
	}
}
