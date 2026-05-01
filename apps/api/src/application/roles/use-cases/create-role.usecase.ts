import { Injectable } from "@nestjs/common";
import { BadRequestError } from "../../../shared/errors/types/bad-request-error";
import { CreateRoleDto } from "../dtos/role.dto";
import { RoleEntity } from "../entities/role.entity";
import { RolesMapper } from "../mappers/role.mapper";
import { RolesRepositoryProps } from "../repositories/roles.repository";

@Injectable()
export class CreateRoleUseCase {
	constructor(private rolesRepository: RolesRepositoryProps) {}

	async execute({ name }: CreateRoleDto) {
		const exists = await this.rolesRepository.findByName(name);

		if (exists) {
			throw new BadRequestError("Role already exists");
		}

		const role = await this.rolesRepository.create({ name });

		return RolesMapper.toRoleResponseDto(new RoleEntity(role));
	}
}
