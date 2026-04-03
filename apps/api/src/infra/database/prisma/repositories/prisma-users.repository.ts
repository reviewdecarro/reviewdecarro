import { Injectable } from "@nestjs/common";
import type { CreateUserDto } from "../../../../application/users/dtos/create-user.dto";
import { UserEntity } from "../../../../application/users/entities/user.entity";
import type { UsersRepositoryProps } from "../../../../application/users/repositories/users.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(user: CreateUserDto): Promise<UserEntity> {
		const created = await this.prisma.user.create({
			data: {
				username: user.username,
				email: user.email,
				passwordHash: user.password,
			},
		});

		return new UserEntity(created);
	}

	async findById(id: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (!user) return null;

		return new UserEntity(user);
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({ where: { email } });

		if (!user) return null;

		return new UserEntity(user);
	}

	async findByUsername(username: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({ where: { username } });

		if (!user) return null;

		return new UserEntity(user);
	}
}
