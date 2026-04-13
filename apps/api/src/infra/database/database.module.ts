import { Module } from "@nestjs/common";
import { UsersRepositoryProps } from "../../domain/users/repositories/users.repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users.repository";

@Module({
	providers: [
		PrismaService,
		{
			provide: UsersRepositoryProps,
			useClass: PrismaUsersRepository,
		},
	],
	exports: [UsersRepositoryProps],
})
export class DatabaseModule {}
