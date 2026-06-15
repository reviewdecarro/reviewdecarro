import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { SearchIndexerService } from "../application/search/services/search-indexer.service";

async function main() {
	const app = await NestFactory.createApplicationContext(AppModule);

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
