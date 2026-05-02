import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
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

	const config = new DocumentBuilder()
		.setTitle("ReviewDeCarro API")
		.setDescription("API para avaliações de carros")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document);

	app.enableCors({
		origin: process.env.WEB_APP_URL ?? "http://localhost:3000",
		credentials: true,
	});
	app.useGlobalInterceptors(
		new BadRequestInterceptor(),
		new NotFoundInterceptor(),
	);
	await app.listen(3333);
}

void bootstrap();
