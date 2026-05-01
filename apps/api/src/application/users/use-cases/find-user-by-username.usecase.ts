import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { UserEntity } from "../entities/user.entity";
import { UsersMapper } from "../mappers/user.mapper";
import { UsersRepositoryProps } from "../repositories/users.repository";

@Injectable()
export class FindUserByUsernameUseCase {
	constructor(private usersRepository: UsersRepositoryProps) {}

	async execute(username: string) {
		const user = await this.usersRepository.findByUsername(username);

		if (!user) {
			throw new BadRequestError("User not found");
		}

		const entity = new UserEntity(user);

		return UsersMapper.toUserResponseDto(entity);
	}
}
