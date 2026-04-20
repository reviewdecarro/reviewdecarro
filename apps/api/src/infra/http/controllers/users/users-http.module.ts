import { Module } from "@nestjs/common";
import { AuthenticateUserUseCase } from "src/domain/users/use-cases/authenticate-user.usecase";
import { ConfirmEmailUseCase } from "src/domain/users/use-cases/confirm-email.usecase";
import { CreateUserUseCase } from "src/domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "src/domain/users/use-cases/find-user-by-username.usecase";
import { AuthModule } from "src/infra/auth/auth.module";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProvidersModule } from "src/infra/providers/providers.module";
import { UsersController } from "./users.controller";

@Module({
	imports: [DatabaseModule, AuthModule, ProvidersModule],
	controllers: [UsersController],
	providers: [
		CreateUserUseCase,
		AuthenticateUserUseCase,
		FindUserByUsernameUseCase,
		ConfirmEmailUseCase,
	],
})
export class UsersHttpModule {}
