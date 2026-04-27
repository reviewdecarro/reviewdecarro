import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthHttpModule } from "./controllers/auth/auth-http.module";
import { CarsHttpModule } from "./controllers/cars/cars-http.module";
import { CommentsHttpModule } from "./controllers/comments/comments-http.module";
import { ReviewsHttpModule } from "./controllers/reviews/reviews-http.module";
import { UsersHttpModule } from "./controllers/users/users-http.module";
import { VotesHttpModule } from "./controllers/votes/votes-http.module";

@Module({
	imports: [
		AuthModule,
		AuthHttpModule,
		UsersHttpModule,
		CarsHttpModule,
		ReviewsHttpModule,
		CommentsHttpModule,
		VotesHttpModule,
	],
	providers: [
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard },
	],
})
export class HttpModule {}
