import { Injectable, Logger } from "@nestjs/common";
import { SearchRepositoryProps } from "../repositories/search.repository";

@Injectable()
export class SearchIndexerService {
	private readonly logger = new Logger(SearchIndexerService.name);

	constructor(private searchRepository: SearchRepositoryProps) {}

	indexReview(reviewId: string) {
		return this.runSafely("review", reviewId, () =>
			this.searchRepository.indexReview(reviewId),
		);
	}

	indexTopic(topicId: string) {
		return this.runSafely("topic", topicId, () =>
			this.searchRepository.indexTopic(topicId),
		);
	}

	removeReview(reviewId: string) {
		return this.runSafely("review", reviewId, () =>
			this.searchRepository.removeReview(reviewId),
		);
	}

	removeTopic(topicId: string) {
		return this.runSafely("topic", topicId, () =>
			this.searchRepository.removeTopic(topicId),
		);
	}

	reindexAll() {
		return this.searchRepository.reindexAll();
	}

	private async runSafely(
		entityType: string,
		entityId: string,
		operation: () => Promise<void>,
	): Promise<void> {
		try {
			await operation();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			this.logger.error(
				`Failed to update search document for ${entityType} ${entityId}: ${message}`,
			);
		}
	}
}
