import { Module } from "@nestjs/common";
import { LoginUseCase } from "src/application/sessions/use-cases/login.usecase";
import { GetAuthenticatedUserUseCase } from "src/application/sessions/use-cases/get-authenticated-user.usecase";
import { RefreshSessionUseCase } from "src/application/sessions/use-cases/refresh-session.usecase";
import { RevokeSessionUseCase } from "src/application/sessions/use-cases/revoke-session.usecase";
import { AuthModule } from "src/infra/auth/auth.module";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProvidersModule } from "src/infra/providers/providers.module";
import { AuthController } from "./auth.controller";

@Module({
	imports: [DatabaseModule, AuthModule, ProvidersModule],
	controllers: [AuthController],
	providers: [
		LoginUseCase,
		GetAuthenticatedUserUseCase,
		RefreshSessionUseCase,
		RevokeSessionUseCase,
	],
})
export class AuthHttpModule {}
