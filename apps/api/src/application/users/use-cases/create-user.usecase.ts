import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { BadRequestError } from '../../../shared/errors/types/bad-request-error';
import type { CreateUserDto } from '../dtos/create-user.dto';
import { toUserDto } from '../mappers/user.mapper';
import type { UsersRepositoryProps } from '../repositories/users.repository';

@Injectable()
export class CreateUserUseCase {
	constructor(private usersRepository: UsersRepositoryProps) {}

	async execute({ username, email, password }: CreateUserDto) {
		const emailExists = await this.usersRepository.findByEmail(email);

		if (emailExists) {
			throw new BadRequestError('Email already exists');
		}

		const usernameExists = await this.usersRepository.findByUsername(username);

		if (usernameExists) {
			throw new BadRequestError('Username already exists');
		}

		const passwordHash = await hash(password, 10);

		const user = await this.usersRepository.create({
			username,
			email,
			password: passwordHash,
		});

		return toUserDto(user);
	}
}
