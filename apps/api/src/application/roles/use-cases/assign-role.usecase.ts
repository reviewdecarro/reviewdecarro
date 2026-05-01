import { Injectable } from "@nestjs/common";
import {
	AssignRoleData,
	RolesRepositoryProps,
} from "../repositories/roles.repository";

@Injectable()
export class AssignRoleUseCase {
	constructor(private rolesRepository: RolesRepositoryProps) {}

	async execute(data: AssignRoleData): Promise<void> {
		return this.rolesRepository.assign(data);
	}
}
