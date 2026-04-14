import { Injectable } from "@nestjs/common";
import { VotesRepositoryProps } from "../repositories/votes.repository";

@Injectable()
export class DeleteVoteUseCase {
	constructor(private votesRepository: VotesRepositoryProps) {}

	async execute(userId: string, reviewId: string) {
		await this.votesRepository.delete(userId, reviewId);
	}
}
