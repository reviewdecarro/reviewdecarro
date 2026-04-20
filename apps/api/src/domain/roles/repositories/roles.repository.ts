import type { RoleType } from "../../../../prisma/generated/enums";
import type { RoleEntity } from "../entities/role.entity";

export interface AssignRoleData {
	userId: string;
	type: RoleType;
}

export abstract class RolesRepositoryProps {
	abstract assign(data: AssignRoleData): Promise<RoleEntity>;
}
