import { Module } from "@nestjs/common";
import { AssignRoleUseCase } from "src/domain/roles/use-cases/assign-role.usecase";
import { ConfirmEmailUseCase } from "src/domain/users/use-cases/confirm-email.usecase";
import { CreateUserUseCase } from "src/domain/users/use-cases/create-user.usecase";
import { FindUserByUsernameUseCase } from "src/domain/users/use-cases/find-user-by-username.usecase";
import { ResetUserPasswordUseCase } from "src/domain/users/use-cases/reset-user-password.usecase";
import { SendForgotPasswordEmailUseCase } from "src/domain/users/use-cases/send-forgot-password-email.usecase";
import { AuthModule } from "src/infra/auth/auth.module";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProvidersModule } from "src/infra/providers/providers.module";
import { UsersController } from "./users.controller";

@Module({
	imports: [DatabaseModule, AuthModule, ProvidersModule],
	controllers: [UsersController],
	providers: [
		CreateUserUseCase,
		FindUserByUsernameUseCase,
		AssignRoleUseCase,
		ConfirmEmailUseCase,
		SendForgotPasswordEmailUseCase,
		ResetUserPasswordUseCase,
	],
})
export class UsersHttpModule {}
