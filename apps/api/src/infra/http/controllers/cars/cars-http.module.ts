import { Module } from "@nestjs/common";
import { CreateBrandUseCase } from "src/application/cars/use-cases/create-brand.usecase";
import { CreateModelUseCase } from "src/application/cars/use-cases/create-model.usecase";
import { CreateVersionUseCase } from "src/application/cars/use-cases/create-version.usecase";
import { GetBrandUseCase } from "src/application/cars/use-cases/get-brand.usecase";
import { GetModelUseCase } from "src/application/cars/use-cases/get-model.usecase";
import { GetVersionUseCase } from "src/application/cars/use-cases/get-version.usecase";
import { ListBrandsUseCase } from "src/application/cars/use-cases/list-brands.usecase";
import { ListModelsUseCase } from "src/application/cars/use-cases/list-models.usecase";
import { ListVersionYearsUseCase } from "src/application/cars/use-cases/list-version-years.usecase";
import { ListVersionsUseCase } from "src/application/cars/use-cases/list-versions.usecase";
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
		ListVersionYearsUseCase,
		GetVersionUseCase,
	],
})
export class CarsHttpModule {}
