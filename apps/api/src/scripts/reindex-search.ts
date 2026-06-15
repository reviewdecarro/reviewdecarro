import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { SearchIndexerService } from "../application/search/services/search-indexer.service";
import { SearchModule } from "../infra/search/search.module";

async function main() {
	const app = await NestFactory.createApplicationContext(SearchModule);

	try {
		const indexer = app.get(SearchIndexerService);
		const result = await indexer.reindexAll();
		process.stdout.write(
			`Search index rebuilt: ${result.reviews} reviews, ${result.topics} topics.\n`,
		);
	} finally {
		await app.close();
	}
}

void main();
