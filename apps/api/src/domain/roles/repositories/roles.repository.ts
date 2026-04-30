import type { RoleEntity } from "../entities/role.entity";

export interface CreateRoleData {
  name: string;
}

export interface AssignRoleData {
  userId: string;
  roleId: string;
}

export abstract class RolesRepositoryProps {
  abstract create(data: CreateRoleData): Promise<RoleEntity>;
  abstract findById(id: string): Promise<RoleEntity | null>;
  abstract findAll(): Promise<RoleEntity[]>;
  abstract findByName(name: string): Promise<RoleEntity | null>;
  abstract assign(data: AssignRoleData): Promise<void>;
}
