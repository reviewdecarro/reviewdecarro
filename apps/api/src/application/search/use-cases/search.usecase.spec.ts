import "reflect-metadata";
import { InMemorySearchRepository } from "../repositories/in-memory-search.repository";
import { SearchSort, SearchType } from "../dtos/search-query.dto";
import { SearchUseCase } from "./search.usecase";

describe("SearchUseCase", () => {
	it("delegates the validated query to the repository", async () => {
		const repository = new InMemorySearchRepository();
		const useCase = new SearchUseCase(repository);
		const search = jest.spyOn(repository, "search");

		await useCase.execute({
			q: "civic 2018",
			type: SearchType.REVIEW,
			sort: SearchSort.RELEVANCE,
			page: 2,
			limit: 10,
		});

		expect(search).toHaveBeenCalledWith({
			q: "civic 2018",
			type: SearchType.REVIEW,
			sort: SearchSort.RELEVANCE,
			page: 2,
			limit: 10,
		});
	});
});
