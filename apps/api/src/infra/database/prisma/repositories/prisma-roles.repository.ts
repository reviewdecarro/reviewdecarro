import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../../../../domain/roles/entities/role.entity";
import {
	AssignRoleData,
	RolesRepositoryProps,
} from "../../../../domain/roles/repositories/roles.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRolesRepository implements RolesRepositoryProps {
	constructor(private prisma: PrismaService) {}

	async assign(data: AssignRoleData): Promise<RoleEntity> {
		const created = await this.prisma.role.create({
			data: {
				userId: data.userId,
				type: data.type,
			},
		});

		return new RoleEntity(created);
	}
}
