import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestInterceptor } from './shared/errors/interceptors/bad-request.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.enableCors();
	app.useGlobalInterceptors(new BadRequestInterceptor());
	await app.listen(3000);
}

void bootstrap();
