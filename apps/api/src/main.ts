import { ForbiddenException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { env } from "./env";
import { BadRequestInterceptor } from "./shared/errors/interceptors/bad-request.interceptor";
import { NotFoundInterceptor } from "./shared/errors/interceptors/not-found.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.useGlobalInterceptors(
		new BadRequestInterceptor(),
		new NotFoundInterceptor(),
	);

	if (env.NODE_ENV === "development") {
		app.enableCors({
			origin: env.WEB_APP_URL ?? "http://localhost:3000",
			credentials: true,
		});
		const config = new DocumentBuilder()
			.setTitle("API PapoAuto")
			.setDescription("application protocol interface of PapoAuto")
			.setVersion("1.0")
			.addBearerAuth()
			.build();

		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api/docs", app, document);
	}

	if (env.NODE_ENV === "production") {
		const whitelist = (env.WHITELIST_REQUESTS as string).split(",");
		app.enableCors({
			origin: (origin, callback) => {
				if (whitelist.indexOf(origin) !== -1 || !origin) {
					callback(null, true);
				} else {
					callback(new ForbiddenException("Not allowed by CORS"));
				}
			},
			methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "HEAD"],
			credentials: true,
		});
	}
	const API_PORT = env.API_PORT;
	await app.listen(API_PORT);
}

void bootstrap();
