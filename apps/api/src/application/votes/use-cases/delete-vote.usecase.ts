import { Injectable, Optional } from "@nestjs/common";
import { SearchIndexerService } from "../../search/services/search-indexer.service";
import { VotesRepositoryProps } from "../repositories/votes.repository";

@Injectable()
export class DeleteVoteUseCase {
	constructor(
		private votesRepository: VotesRepositoryProps,
		@Optional() private searchIndexer?: SearchIndexerService,
	) {}

	async execute(userId: string, reviewId: string) {
		await this.votesRepository.delete(userId, reviewId);
		await this.searchIndexer?.indexReview(reviewId);
	}
}
