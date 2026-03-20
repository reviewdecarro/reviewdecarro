import { Exclude, Expose } from "class-transformer";
import type { UserModel } from "../../../../prisma/generated/models/User";

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
	createdAt: Date;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
