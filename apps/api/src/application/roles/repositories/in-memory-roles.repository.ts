import { randomUUID } from "node:crypto";
import { RoleEntity } from "../entities/role.entity";
import {
	AssignRoleData,
	CreateRoleData,
	RolesRepositoryProps,
} from "./roles.repository";

export class InMemoryRolesRepository extends RolesRepositoryProps {
	public items: RoleEntity[] = [];
	public assignments: AssignRoleData[] = [];

	async create(data: CreateRoleData): Promise<RoleEntity> {
		const entity = new RoleEntity({
			id: randomUUID(),
			name: data.name,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		this.items.push(entity);
		return entity;
	}

	async findById(id: string): Promise<RoleEntity | null> {
		return this.items.find((r) => r.id === id) ?? null;
	}

	async findAll(): Promise<RoleEntity[]> {
		return this.items;
	}

	async findByName(name: string): Promise<RoleEntity | null> {
		return this.items.find((r) => r.name === name) ?? null;
	}

	async assign(data: AssignRoleData): Promise<void> {
		this.assignments.push(data);
	}
}
