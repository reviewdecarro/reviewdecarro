import { Injectable } from "@nestjs/common";
import { RoleType } from "../../../../prisma/generated/enums";
import { RolesRepositoryProps } from "../repositories/roles.repository";

interface AssignRoleInput {
	userId: string;
	type: RoleType;
}

@Injectable()
export class AssignRoleUseCase {
	constructor(private rolesRepository: RolesRepositoryProps) {}

	async execute(data: AssignRoleInput) {
		return this.rolesRepository.assign(data);
	}
}
