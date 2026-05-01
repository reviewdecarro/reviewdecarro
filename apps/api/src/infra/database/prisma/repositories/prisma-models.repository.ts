import { Injectable } from "@nestjs/common";
import type { CreateModelDto } from "../../../../application/cars/dtos/create-model.dto";
import { CarModelEntity } from "../../../../application/cars/entities/car-model.entity";
import type { ModelsRepositoryProps } from "../../../../application/cars/repositories/models.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaModelsRepository implements ModelsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(brandId: string, data: CreateModelDto): Promise<CarModelEntity> {
		const model = await this.prisma.model.create({
			data: {
				name: data.name,
				slug: data.slug,
				brandId,
			},
		});

		return new CarModelEntity(model);
	}

	async findByBrandId(brandId: string): Promise<CarModelEntity[]> {
		const models = await this.prisma.model.findMany({
			where: { brandId },
			orderBy: { name: "asc" },
		});

		return models.map((model) => new CarModelEntity(model));
	}

	async findByBrandIdAndSlug(
		brandId: string,
		slug: string,
	): Promise<CarModelEntity | null> {
		const model = await this.prisma.model.findUnique({
			where: { brandId_slug: { brandId, slug } },
		});

		if (!model) return null;

		return new CarModelEntity(model);
	}

	async findByBrandIdAndSlugWithVersions(
		brandId: string,
		slug: string,
	): Promise<CarModelEntity | null> {
		const model = await this.prisma.model.findUnique({
			where: { brandId_slug: { brandId, slug } },
			include: { carVersions: { orderBy: { year: "desc" } } },
		});

		if (!model) return null;

		return new CarModelEntity(model);
	}
}
