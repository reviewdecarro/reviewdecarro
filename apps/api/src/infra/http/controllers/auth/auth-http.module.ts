import { Module } from "@nestjs/common";
import { LoginUseCase } from "src/domain/sessions/use-cases/login.usecase";
import { RefreshSessionUseCase } from "src/domain/sessions/use-cases/refresh-session.usecase";
import { RevokeSessionUseCase } from "src/domain/sessions/use-cases/revoke-session.usecase";
import { AuthModule } from "src/infra/auth/auth.module";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProvidersModule } from "src/infra/providers/providers.module";
import { AuthController } from "./auth.controller";

@Module({
	imports: [DatabaseModule, AuthModule, ProvidersModule],
	controllers: [AuthController],
	providers: [LoginUseCase, RefreshSessionUseCase, RevokeSessionUseCase],
})
export class AuthHttpModule {}
