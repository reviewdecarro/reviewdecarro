import { Expose } from "class-transformer";
import { UserTokenModel } from "../../../../prisma/generated/models/UserToken";

export class UserTokenEntity implements UserTokenModel {
	@Expose()
	id: string;

	@Expose()
	refreshToken: string;

	@Expose()
	expiresDate: Date;

	@Expose()
	userId: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	constructor(partial: Partial<UserTokenEntity>) {
		Object.assign(this, partial);
	}
}
