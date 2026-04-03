import { Module } from "@nestjs/common";
import { AuthenticateUserUseCase } from "../../application/users/use-cases/authenticate-user.usecase";
import { CreateUserUseCase } from "../../application/users/use-cases/create-user.usecase";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { UsersController } from "./controllers/users/users.controller";

@Module({
	imports: [DatabaseModule, AuthModule],
	controllers: [UsersController],
	providers: [CreateUserUseCase, AuthenticateUserUseCase],
})
export class HttpModule {}
