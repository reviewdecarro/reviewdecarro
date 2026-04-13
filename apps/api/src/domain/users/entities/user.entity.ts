import { Exclude, Expose } from "class-transformer";
import { UserModel } from "../../../../prisma/generated/models/User";

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
	createdAt: Date;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
