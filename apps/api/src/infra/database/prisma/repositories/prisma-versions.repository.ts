import { Injectable } from "@nestjs/common";
import type { CreateVersionDto } from "../../../../application/cars/dtos/create-version.dto";
import { CarVersionYearEntity } from "../../../../application/cars/entities/car-version-year.entity";
import { CarVersionEntity } from "../../../../application/cars/entities/car-version.entity";
import type { VersionsRepositoryProps } from "../../../../application/cars/repositories/versions.repository";
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
				versionName: data.versionName,
				engine: data.engine ?? null,
				transmission: data.transmission ?? null,
				slug: data.slug,
				years: {
					create: {
						year: data.year,
					},
				},
			},
			include: {
				years: true,
			},
		});

		return new CarVersionEntity({
			...version,
			years: version.years.map(
				(year) =>
					new CarVersionYearEntity({
						...year,
					}),
			),
			year: version.years[0]?.year,
		});
	}

	async findById(id: string): Promise<CarVersionEntity | null> {
		const version = await this.prisma.carVersion.findUnique({
			where: { id },
			include: {
				years: {
					orderBy: { year: "desc" },
				},
			},
		});

		if (!version) return null;

		return new CarVersionEntity({
			...version,
			years: version.years.map(
				(year) =>
					new CarVersionYearEntity({
						...year,
					}),
			),
			year: version.years[0]?.year,
		});
	}

	async findByModelId(modelId: string): Promise<CarVersionEntity[]> {
		const versions = await this.prisma.carVersion.findMany({
			where: { modelId },
			include: {
				years: {
					orderBy: { year: "desc" },
				},
			},
			orderBy: { createdAt: "asc" },
		});

		return versions.map(
			(version) =>
				new CarVersionEntity({
					...version,
					years: version.years.map(
						(year) =>
							new CarVersionYearEntity({
								...year,
							}),
					),
					year: version.years[0]?.year,
				}),
		);
	}

	async findBySlug(slug: string): Promise<CarVersionEntity | null> {
		const version = await this.prisma.carVersion.findFirst({
			where: { slug },
			include: {
				years: {
					orderBy: { year: "desc" },
				},
			},
		});

		if (!version) return null;

		return new CarVersionEntity({
			...version,
			years: version.years.map(
				(year) =>
					new CarVersionYearEntity({
						...year,
					}),
			),
			year: version.years[0]?.year,
		});
	}

	async findYearsByModelId(modelId: string): Promise<number[]> {
		const years = await this.prisma.carVersionYear.findMany({
			where: {
				carVersion: {
					modelId,
				},
			},
			select: {
				year: true,
			},
			distinct: ["year"],
			orderBy: {
				year: "desc",
			},
		});

		return years.map(({ year }) => year);
	}

	async findYearById(id: string): Promise<CarVersionYearEntity | null> {
		const year = await this.prisma.carVersionYear.findUnique({
			where: { id },
		});

		if (!year) return null;

		return new CarVersionYearEntity(year);
	}
}
