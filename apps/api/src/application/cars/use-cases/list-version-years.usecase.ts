import { Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { BrandsRepositoryProps } from "../repositories/brands.repository";
import { ModelsRepositoryProps } from "../repositories/models.repository";
import { VersionsRepositoryProps } from "../repositories/versions.repository";

@Injectable()
export class ListVersionYearsUseCase {
	constructor(
		private brandsRepository: BrandsRepositoryProps,
		private modelsRepository: ModelsRepositoryProps,
		private versionsRepository: VersionsRepositoryProps,
	) {}

	async execute(brandSlug: string, modelSlug: string) {
		const brand = await this.brandsRepository.findBySlug(brandSlug);

		if (!brand) {
			throw new NotFoundError("Brand not found");
		}

		const model = await this.modelsRepository.findByBrandIdAndSlug(
			brand.id,
			modelSlug,
		);

		if (!model) {
			throw new NotFoundError("Model not found");
		}

		const years = await this.versionsRepository.findYearsByModelId(model.id);

		return { years: years.map((year) => ({ year })) };
	}
}
