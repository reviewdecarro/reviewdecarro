import { Exclude, Expose } from "class-transformer";
import { UserModel } from "../../../../prisma/generated/models/User";
import { RoleEntity } from "../../roles/entities/role.entity";

export class UserEntity implements UserModel {
	@Expose()
	id: string;

	@Expose()
	username: string;

	@Expose()
	email: string;

	@Exclude()
	passwordHash: string;

	@Expose()
	active: boolean;

	@Expose()
	confirmedEmail: boolean;

	@Expose()
	createdAt: Date;

	@Expose()
	roles?: RoleEntity[];

	constructor({ roles, ...partial }: Partial<UserEntity>) {
		Object.assign(this, partial);

		if (roles) {
			this.roles = roles.map((role) => new RoleEntity(role));
		}
	}
}
