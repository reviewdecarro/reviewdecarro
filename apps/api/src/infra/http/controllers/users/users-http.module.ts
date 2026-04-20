import { Module } from "@nestjs/common";
import { AuthenticateUserUseCase } from "src/domain/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "src/domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "src/domain/users/use-cases/find-user-by-username.usecase";
import { AuthModule } from "src/infra/auth/auth.module";
import { DatabaseModule } from "src/infra/database/database.module";
import { UsersController } from "./users.controller";

@Module({
	imports: [DatabaseModule, AuthModule],
	controllers: [UsersController],
	providers: [
		CreateUserUseCase,
		AuthenticateUserUseCase,
		FindUserByUsernameUseCase,
	],
})
export class UsersHttpModule {}
