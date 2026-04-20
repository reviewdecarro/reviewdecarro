import { Injectable } from "@nestjs/common";
import { HashProviderProps } from "src/infra/providers/hash/types/hash-provider.props";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import { UsersMapper } from "../mappers/user.mapper";
import { UsersRepositoryProps } from "../repositories/users.repository";

@Injectable()
export class CreateUserUseCase {
	constructor(
		private usersRepository: UsersRepositoryProps,
		private hashProvider: HashProviderProps,
	) {}

	async execute({ username, email, password }: CreateUserDto) {
		const emailExists = await this.usersRepository.findByEmail(email);

		if (emailExists) {
			throw new BadRequestError("Email já existe.");
		}

		const usernameExists = await this.usersRepository.findByUsername(username);

		if (usernameExists) {
			throw new BadRequestError("Username já existe.");
		}

		const passwordHash = await this.hashProvider.hash(password);

		const user = await this.usersRepository.create({
			username,
			email,
			password: passwordHash,
		});

		const entity = new UserEntity(user);

		return UsersMapper.toUserResponseDto(entity);
	}
}
