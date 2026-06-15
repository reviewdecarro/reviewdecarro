import { Module } from "@nestjs/common";
import { SearchUseCase } from "../../../../application/search/use-cases/search.usecase";
import { DatabaseModule } from "../../../database/database.module";
import { SearchController } from "./search.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [SearchController],
	providers: [SearchUseCase],
})
export class SearchHttpModule {}
