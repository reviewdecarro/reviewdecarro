import { Module } from "@nestjs/common";
import { CreateBrandUseCase } from "src/domain/cars/use-cases/create-brand.usecase";
import { CreateModelUseCase } from "src/domain/cars/use-cases/create-model.usecase";
import { CreateVersionUseCase } from "src/domain/cars/use-cases/create-version.usecase";
import { GetBrandUseCase } from "src/domain/cars/use-cases/get-brand.usecase";
import { GetModelUseCase } from "src/domain/cars/use-cases/get-model.usecase";
import { GetVersionUseCase } from "src/domain/cars/use-cases/get-version.usecase";
import { ListBrandsUseCase } from "src/domain/cars/use-cases/list-brands.usecase";
import { ListModelsUseCase } from "src/domain/cars/use-cases/list-models.usecase";
import { ListVersionsUseCase } from "src/domain/cars/use-cases/list-versions.usecase";
import { DatabaseModule } from "src/infra/database/database.module";
import { BrandsController } from "../brands/brands.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [BrandsController],
	providers: [
		CreateBrandUseCase,
		ListBrandsUseCase,
		GetBrandUseCase,
		CreateModelUseCase,
		ListModelsUseCase,
		GetModelUseCase,
		CreateVersionUseCase,
		ListVersionsUseCase,
		GetVersionUseCase,
	],
})
export class CarsHttpModule {}
