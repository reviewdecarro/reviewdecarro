import { Module } from "@nestjs/common";
import { DeleteVoteUseCase } from "src/application/votes/use-cases/delete-vote.usecase";
import { UpsertVoteUseCase } from "src/application/votes/use-cases/upsert-vote.usecase";
import { DatabaseModule } from "src/infra/database/database.module";
import { VotesController } from "./votes.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [VotesController],
	providers: [UpsertVoteUseCase, DeleteVoteUseCase],
})
export class VotesHttpModule {}
