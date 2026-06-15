import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SearchQueryDto } from "../../../../application/search/dtos/search-query.dto";
import { SearchUseCase } from "../../../../application/search/use-cases/search.usecase";
import { IsPublic } from "../../../../shared/decorators/is-public.decorator";

@ApiTags("Search")
@Controller("search")
export class SearchController {
	constructor(private searchUseCase: SearchUseCase) {}

	@Get()
	@IsPublic()
	@ApiOperation({ description: "Buscar avaliações e tópicos" })
	@ApiOkResponse({ description: "Resultados paginados da busca" })
	search(@Query() query: SearchQueryDto) {
		return this.searchUseCase.execute(query);
	}
}
