import { InMemorySearchRepository } from "../repositories/in-memory-search.repository";
import { SearchIndexerService } from "./search-indexer.service";

describe("SearchIndexerService", () => {
	it("indexes and removes supported entities", async () => {
		const repository = new InMemorySearchRepository();
		const indexer = new SearchIndexerService(repository);

		await indexer.indexReview("review-1");
		await indexer.indexTopic("topic-1");
		await indexer.removeReview("review-2");
		await indexer.removeTopic("topic-2");

		expect(repository.indexedReviews).toEqual(["review-1"]);
		expect(repository.indexedTopics).toEqual(["topic-1"]);
		expect(repository.removedReviews).toEqual(["review-2"]);
		expect(repository.removedTopics).toEqual(["topic-2"]);
	});

	it("does not reject the domain operation when indexing fails", async () => {
		const repository = new InMemorySearchRepository();
		jest.spyOn(repository, "indexReview").mockRejectedValue(new Error("offline"));
		jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
		const indexer = new SearchIndexerService(repository);

		await expect(indexer.indexReview("review-1")).resolves.toBeUndefined();
	});
});
import { Logger } from "@nestjs/common";
