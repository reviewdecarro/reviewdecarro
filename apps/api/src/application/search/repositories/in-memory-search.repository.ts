import { SearchQueryDto } from "../dtos/search-query.dto";
import { SearchResultDto } from "../dtos/search-result.dto";
import { SearchRepositoryProps } from "./search.repository";

export class InMemorySearchRepository extends SearchRepositoryProps {
	indexedReviews: string[] = [];
	indexedTopics: string[] = [];
	removedReviews: string[] = [];
	removedTopics: string[] = [];
	result: SearchResultDto = {
		items: [],
		meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
	};

	async search(_params: SearchQueryDto): Promise<SearchResultDto> {
		void _params;
		return this.result;
	}

	async indexReview(reviewId: string): Promise<void> {
		this.indexedReviews.push(reviewId);
	}

	async indexTopic(topicId: string): Promise<void> {
		this.indexedTopics.push(topicId);
	}

	async removeReview(reviewId: string): Promise<void> {
		this.removedReviews.push(reviewId);
	}

	async removeTopic(topicId: string): Promise<void> {
		this.removedTopics.push(topicId);
	}

	async reindexAll(): Promise<{ reviews: number; topics: number }> {
		return {
			reviews: this.indexedReviews.length,
			topics: this.indexedTopics.length,
		};
	}
}
