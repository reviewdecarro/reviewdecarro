import { Injectable } from "@nestjs/common";
import type { CreateVersionDto } from "../../../../domain/cars/dtos/create-version.dto";
import { CarVersionEntity } from "../../../../domain/cars/entities/car-version.entity";
import type { VersionsRepositoryProps } from "../../../../domain/cars/repositories/versions.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaVersionsRepository implements VersionsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(
		modelId: string,
		data: CreateVersionDto,
	): Promise<CarVersionEntity> {
		const version = await this.prisma.carVersion.create({
			data: {
				modelId,
				year: data.year,
				versionName: data.versionName,
				engine: data.engine ?? null,
				transmission: data.transmission ?? null,
				slug: data.slug,
			},
		});

		return new CarVersionEntity(version);
	}

	async findById(id: string): Promise<CarVersionEntity | null> {
		const version = await this.prisma.carVersion.findUnique({
			where: { id },
		});

		if (!version) return null;

		return new CarVersionEntity(version);
	}

	async findByModelId(modelId: string): Promise<CarVersionEntity[]> {
		const versions = await this.prisma.carVersion.findMany({
			where: { modelId },
			orderBy: { year: "desc" },
		});

		return versions.map((v) => new CarVersionEntity(v));
	}

	async findBySlug(slug: string): Promise<CarVersionEntity | null> {
		const version = await this.prisma.carVersion.findUnique({
			where: { slug },
		});

		if (!version) return null;

		return new CarVersionEntity(version);
	}
}
