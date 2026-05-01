import { Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { RoleEntity } from "../entities/role.entity";
import { RolesMapper } from "../mappers/role.mapper";
import { RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class FindRoleByIdUseCase {
	constructor(private rolesRepository: RolesRepositoryProps) {}

	async execute(id: string) {
		const role = await this.rolesRepository.findById(id);

		if (!role) {
			throw new NotFoundError("Role not found");
		}

		return RolesMapper.toRoleResponseDto(new RoleEntity(role));
	}
}
