import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import { toUserResponseDto } from "../mappers/user.mapper";
import { UsersRepositoryProps } from "../repositories/users.repository";

@Injectable()
export class CreateUserUseCase {
	constructor(private usersRepository: UsersRepositoryProps) {}

	async execute({ username, email, password }: CreateUserDto) {
		const emailExists = await this.usersRepository.findByEmail(email);

		if (emailExists) {
			throw new BadRequestError("Email already exists");
		}

		const usernameExists = await this.usersRepository.findByUsername(username);

		if (usernameExists) {
			throw new BadRequestError("Username already exists");
		}

		const passwordHash = await hash(password, 10);

		const user = await this.usersRepository.create({
			username,
			email,
			password: passwordHash,
		});

		const entity = new UserEntity(user);

		return toUserResponseDto(entity);
	}
}
