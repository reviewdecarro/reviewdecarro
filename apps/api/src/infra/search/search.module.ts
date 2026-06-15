import { Module } from "@nestjs/common";
import { SearchIndexerService } from "../../application/search/services/search-indexer.service";
import { DatabaseModule } from "../database/database.module";

@Module({
	imports: [DatabaseModule],
	providers: [SearchIndexerService],
	exports: [SearchIndexerService],
})
export class SearchModule {}
