import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Res,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { CreateBrandDto } from "src/domain/cars/dtos/create-brand.dto";
import { CreateModelDto } from "src/domain/cars/dtos/create-model.dto";
import { CreateVersionDto } from "src/domain/cars/dtos/create-version.dto";
import { CreateBrandUseCase } from "src/domain/cars/use-cases/create-brand.usecase";
import { CreateModelUseCase } from "src/domain/cars/use-cases/create-model.usecase";
import { CreateVersionUseCase } from "src/domain/cars/use-cases/create-version.usecase";
import { GetBrandUseCase } from "src/domain/cars/use-cases/get-brand.usecase";
import { GetModelUseCase } from "src/domain/cars/use-cases/get-model.usecase";
import { GetVersionUseCase } from "src/domain/cars/use-cases/get-version.usecase";
import { ListBrandsUseCase } from "src/domain/cars/use-cases/list-brands.usecase";
import { ListModelsUseCase } from "src/domain/cars/use-cases/list-models.usecase";
import { ListVersionsUseCase } from "src/domain/cars/use-cases/list-versions.usecase";
import { Roles } from "src/infra/auth/decorators/roles.decorator";
import { IsPublic } from "src/shared/decorators/is-public.decorator";

@ApiTags("Brands")
@Controller("brands")
export class BrandsController {
	constructor(
		private createBrandService: CreateBrandUseCase,
		private listBrandsService: ListBrandsUseCase,
		private getBrandService: GetBrandUseCase,
		private createModelService: CreateModelUseCase,
		private listModelsService: ListModelsUseCase,
		private getModelService: GetModelUseCase,
		private createVersionService: CreateVersionUseCase,
		private listVersionsService: ListVersionsUseCase,
		private getVersionService: GetVersionUseCase,
	) {}

	@Post()
	@Roles("admin")
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar nova marca (ADMIN)" })
	@ApiCreatedResponse({ description: "Marca criada com sucesso" })
	@ApiBadRequestResponse({ description: "Slug já existe" })
	async createBrand(@Body() data: CreateBrandDto, @Res() res: Response) {
		const brand = await this.createBrandService.execute(data);

		return res.status(HttpStatus.CREATED).json({
			message: "Marca criada com sucesso.",
			brand,
		});
	}

	@Get()
	@IsPublic()
	@ApiOperation({ description: "Listar todas as marcas" })
	@ApiOkResponse({ description: "Lista de marcas" })
	async listBrands(@Res() res: Response) {
		const brands = await this.listBrandsService.execute();

		return res.status(HttpStatus.OK).json({ brands });
	}

	@Get(":brandSlug")
	@IsPublic()
	@ApiOperation({ description: "Buscar marca por slug com modelos" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiOkResponse({ description: "Marca com modelos" })
	@ApiNotFoundResponse({ description: "Marca não encontrada" })
	async getBrand(@Param("brandSlug") brandSlug: string, @Res() res: Response) {
		const brand = await this.getBrandService.execute(brandSlug);
		return res.status(HttpStatus.OK).json({ brand });
	}

	@Post(":brandSlug/models")
	@Roles("admin")
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar novo modelo (ADMIN)" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiCreatedResponse({ description: "Modelo criado com sucesso" })
	@ApiBadRequestResponse({
		description: "Marca não encontrada ou slug duplicado",
	})
	async createModel(
		@Param("brandSlug") brandSlug: string,
		@Body() data: CreateModelDto,
		@Res() res: Response,
	) {
		const model = await this.createModelService.execute(brandSlug, data);

		return res.status(HttpStatus.CREATED).json({
			message: "Modelo criado com sucesso.",
			model,
		});
	}

	@Get(":brandSlug/models")
	@IsPublic()
	@ApiOperation({ description: "Listar modelos de uma marca" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiOkResponse({ description: "Lista de modelos" })
	async listModels(
		@Param("brandSlug") brandSlug: string,
		@Res() res: Response,
	) {
		const models = await this.listModelsService.execute(brandSlug);

		return res.status(HttpStatus.OK).json({ models });
	}

	@Get(":brandSlug/models/:modelSlug")
	@IsPublic()
	@ApiOperation({ description: "Buscar modelo por slug com versões" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiParam({ name: "modelSlug", example: "polo" })
	@ApiOkResponse({ description: "Modelo com versões" })
	@ApiNotFoundResponse({ description: "Marca ou modelo não encontrado" })
	async getModel(
		@Param("brandSlug") brandSlug: string,
		@Param("modelSlug") modelSlug: string,
		@Res() res: Response,
	) {
		const model = await this.getModelService.execute(brandSlug, modelSlug);
		return res.status(HttpStatus.OK).json({ model });
	}

	@Post(":brandSlug/models/:modelSlug/versions")
	@Roles("admin")
	@ApiBearerAuth()
	@ApiOperation({ description: "Criar nova versão (ADMIN)" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiParam({ name: "modelSlug", example: "polo" })
	@ApiCreatedResponse({ description: "Versão criada com sucesso" })
	@ApiBadRequestResponse({
		description: "Modelo não encontrado ou slug duplicado",
	})
	async createVersion(
		@Param("brandSlug") brandSlug: string,
		@Param("modelSlug") modelSlug: string,
		@Body() data: CreateVersionDto,
		@Res() res: Response,
	) {
		const version = await this.createVersionService.execute(
			brandSlug,
			modelSlug,
			data,
		);

		return res.status(HttpStatus.CREATED).json({
			message: "Versão criada com sucesso.",
			version,
		});
	}

	@Get(":brandSlug/models/:modelSlug/versions")
	@IsPublic()
	@ApiOperation({ description: "Listar versões de um modelo" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiParam({ name: "modelSlug", example: "polo" })
	@ApiOkResponse({ description: "Lista de versões" })
	async listVersions(
		@Param("brandSlug") brandSlug: string,
		@Param("modelSlug") modelSlug: string,
		@Res() res: Response,
	) {
		const versions = await this.listVersionsService.execute(
			brandSlug,
			modelSlug,
		);

		return res.status(HttpStatus.OK).json({ versions });
	}

	@Get(":brandSlug/models/:modelSlug/versions/:versionSlug")
	@IsPublic()
	@ApiOperation({ description: "Buscar versão por slug" })
	@ApiParam({ name: "brandSlug", example: "volkswagen" })
	@ApiParam({ name: "modelSlug", example: "polo" })
	@ApiParam({ name: "versionSlug", example: "2024-polo-track" })
	@ApiOkResponse({ description: "Detalhes da versão" })
	@ApiNotFoundResponse({ description: "Versão não encontrada" })
	async getVersion(
		@Param("versionSlug") versionSlug: string,
		@Res() res: Response,
	) {
		const version = await this.getVersionService.execute(versionSlug);
		return res.status(HttpStatus.OK).json({ version });
	}
}
