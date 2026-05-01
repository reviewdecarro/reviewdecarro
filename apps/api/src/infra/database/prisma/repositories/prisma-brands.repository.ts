import { Injectable } from "@nestjs/common";
import type { CreateBrandDto } from "../../../../application/cars/dtos/create-brand.dto";
import { BrandEntity } from "../../../../application/cars/entities/brand.entity";
import type { BrandsRepositoryProps } from "../../../../application/cars/repositories/brands.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaBrandsRepository implements BrandsRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateBrandDto): Promise<BrandEntity> {
		const brand = await this.prisma.brand.create({
			data: {
				name: data.name,
				slug: data.slug,
			},
		});

		return new BrandEntity(brand);
	}

	async findAll(): Promise<BrandEntity[]> {
		const brands = await this.prisma.brand.findMany({
			orderBy: { name: "asc" },
		});

		return brands.map((brand) => new BrandEntity(brand));
	}

	async findBySlug(slug: string): Promise<BrandEntity | null> {
		const brand = await this.prisma.brand.findUnique({
			where: { slug },
		});

		if (!brand) return null;

		return new BrandEntity(brand);
	}

	async findBySlugWithModels(slug: string): Promise<BrandEntity | null> {
		const brand = await this.prisma.brand.findUnique({
			where: { slug },
			include: { models: { orderBy: { name: "asc" } } },
		});

		if (!brand) return null;

		return new BrandEntity(brand);
	}
}
