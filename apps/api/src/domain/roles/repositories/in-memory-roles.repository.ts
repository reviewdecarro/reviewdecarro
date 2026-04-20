import { randomUUID } from "node:crypto";
import { RoleEntity } from "../entities/role.entity";
import { AssignRoleData, RolesRepositoryProps } from "./roles.repository";

export class InMemoryRolesRepository extends RolesRepositoryProps {
	public items: RoleEntity[] = [];

	async assign(data: AssignRoleData): Promise<RoleEntity> {
		const entity = new RoleEntity({
			id: randomUUID(),
			type: data.type,
			userId: data.userId,
		});

		this.items.push(entity);

		return entity;
	}
}
