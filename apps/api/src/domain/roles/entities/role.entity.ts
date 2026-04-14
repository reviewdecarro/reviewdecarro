import { Expose } from "class-transformer";
import { RoleType } from "../../../../prisma/generated/enums";
import { RoleModel } from "../../../../prisma/generated/models/Role";

export class RoleEntity implements RoleModel {
	@Expose()
	id: string;

	@Expose()
	type: RoleType;

	@Expose()
	userId: string;

	constructor(partial: Partial<RoleEntity>) {
		Object.assign(this, partial);
	}
}
