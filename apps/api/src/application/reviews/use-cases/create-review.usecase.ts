import { Injectable, Optional } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { slugify } from "../../../shared/utils/slugify";
import { VersionsRepositoryProps } from "../../cars/repositories/versions.repository";
import { SearchIndexerService } from "../../search/services/search-indexer.service";
import { CreateReviewDto } from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewsMapper } from "../mappers/review.mapper";
import { ReviewsRepositoryProps } from "../repositories/reviews.repository";

@Injectable()
export class CreateReviewUseCase {
	constructor(
		private reviewsRepository: ReviewsRepositoryProps,
		private versionsRepository: VersionsRepositoryProps,
		@Optional() private searchIndexer?: SearchIndexerService,
	) {}

	async execute(userId: string, data: CreateReviewDto) {
		const carVersionYearId = data.carVersionYearId ?? "";
		const year = await this.versionsRepository.findYearById(carVersionYearId);

		if (!year) {
			throw new BadRequestError("Car version not found");
		}

		const slug = await this.buildUniqueSlug(data.title);

		const review = await this.reviewsRepository.create(userId, slug, data);
		await this.searchIndexer?.indexReview(review.id);

		return ReviewsMapper.toReviewResponseDto(new ReviewEntity(review));
	}

	private async buildUniqueSlug(title: string): Promise<string> {
		const base = slugify(title);

		if (!base) {
			throw new BadRequestError("Cannot generate slug from title");
		}

		let candidate = base;
		let suffix = 2;

		while (await this.reviewsRepository.findBySlug(candidate)) {
			candidate = `${base}-${suffix}`;
			suffix += 1;
		}

		return candidate;
	}
}
