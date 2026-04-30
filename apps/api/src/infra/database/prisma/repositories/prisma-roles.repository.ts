import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../../../../domain/roles/entities/role.entity";
import { AssignRoleData, CreateRoleData, RolesRepositoryProps } from "../../../../domain/roles/repositories/roles.repository";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaRolesRepository implements RolesRepositoryProps {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRoleData): Promise<RoleEntity> {
    const role = await this.prisma.role.create({ data: { name: data.name } });
    return new RoleEntity(role);
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    return role ? new RoleEntity(role) : null;
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((r) => new RoleEntity(r));
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const role = await this.prisma.role.findUnique({ where: { name } });
    return role ? new RoleEntity(role) : null;
  }

  async assign(data: AssignRoleData): Promise<void> {
    await this.prisma.role.update({
      where: { id: data.roleId },
      data: { users: { connect: { id: data.userId } } },
    });
  }
}
