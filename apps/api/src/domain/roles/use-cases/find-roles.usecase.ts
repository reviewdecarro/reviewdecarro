import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity";
import { RolesMapper } from "../mappers/role.mapper";
import { RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class FindRolesUseCase {
  constructor(private rolesRepository: RolesRepositoryProps) {}

  async execute() {
    const roles = await this.rolesRepository.findAll();

    return roles.map((role) => RolesMapper.toRoleResponseDto(new RoleEntity(role)));
  }
}
