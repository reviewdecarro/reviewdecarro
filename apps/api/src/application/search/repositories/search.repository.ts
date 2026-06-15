import { SearchQueryDto } from "../dtos/search-query.dto";
import { SearchResultDto } from "../dtos/search-result.dto";

export abstract class SearchRepositoryProps {
	abstract search(params: SearchQueryDto): Promise<SearchResultDto>;
	abstract indexReview(reviewId: string): Promise<void>;
	abstract indexTopic(topicId: string): Promise<void>;
	abstract removeReview(reviewId: string): Promise<void>;
	abstract removeTopic(topicId: string): Promise<void>;
	abstract reindexAll(): Promise<{ reviews: number; topics: number }>;
}
