import { Injectable } from "@nestjs/common";
import { SearchQueryDto } from "../dtos/search-query.dto";
import { SearchRepositoryProps } from "../repositories/search.repository";

@Injectable()
export class SearchUseCase {
	constructor(private searchRepository: SearchRepositoryProps) {}

	execute(params: SearchQueryDto) {
		return this.searchRepository.search(params);
	}
}
