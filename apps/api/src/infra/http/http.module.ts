import { Module } from "@nestjs/common";
import { AuthenticateUserUseCase } from "../../domain/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "../../domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "../../domain/users/use-cases/find-user-by-username.usecase";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { UsersController } from "./controllers/users/users.controller";

@Module({
	imports: [DatabaseModule, AuthModule],
	controllers: [UsersController],
	providers: [
		CreateUserUseCase,
		AuthenticateUserUseCase,
		FindUserByUsernameUseCase,
	],
})
export class HttpModule {}
