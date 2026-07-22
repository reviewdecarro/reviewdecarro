import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../../../../application/roles/entities/role.entity";
import type { CreateUserDto } from "../../../../application/users/dtos/create-user.dto";
import { UserEntity } from "../../../../application/users/entities/user.entity";
import type {
	AdminUsersListParams,
	AdminUsersListResult,
	UsersRepositoryProps,
} from "../../../../application/users/repositories/users.repository";
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
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: { roles: true },
		});

		if (!user) return null;

		const { roles, ...userData } = user;

		return new UserEntity({
			...userData,
			roles: roles.map((role) => new RoleEntity(role)),
		});
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
			include: {
				roles: true,
			},
		});

		if (!user) return null;

		return new UserEntity(user);
	}

	async findByUsername(username: string): Promise<UserEntity | null> {
		const user = await this.prisma.user.findUnique({
			where: { username },
			include: {
				roles: true,
			},
		});

		if (!user) return null;

		return new UserEntity(user);
	}

	async countActive(): Promise<number> {
		return this.prisma.user.count({ where: { active: true } });
	}

	async findManyForAdmin(
		params: AdminUsersListParams,
	): Promise<AdminUsersListResult> {
		const where = params.query?.trim()
			? {
					username: {
						contains: params.query.trim(),
						mode: "insensitive" as const,
					},
				}
			: {};

		const [users, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				include: { roles: true },
				orderBy: { createdAt: "desc" },
				skip: (params.page - 1) * params.limit,
				take: params.limit,
			}),
			this.prisma.user.count({ where }),
		]);

		return {
			users: users.map(
				({ roles, ...user }) =>
					new UserEntity({
						...user,
						roles: roles.map((role) => new RoleEntity(role)),
					}),
			),
			total,
		};
	}

	async confirmEmail(id: string): Promise<void> {
		await this.prisma.user.update({
			where: { id },
			data: { confirmedEmail: true },
		});
	}

	async updatePassword(id: string, passwordHash: string): Promise<void> {
		await this.prisma.user.update({
			where: { id },
			data: { passwordHash },
		});
	}

	async delete(id: string): Promise<void> {
		await this.prisma.user.delete({ where: { id } });
	}
}
