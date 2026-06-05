import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UsersRepositoryProps } from "../repositories/users.repository";

@Injectable()
export class DeleteAccountUseCase {
	constructor(private usersRepository: UsersRepositoryProps) {}

	async execute(id: string): Promise<void> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new BadRequestError("User not found");
		}

		await this.usersRepository.delete(id);
	}
}
