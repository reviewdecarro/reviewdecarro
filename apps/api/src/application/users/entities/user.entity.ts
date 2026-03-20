import type { UserModel } from '../../../../prisma/generated/models/User';

export class UserEntity implements UserModel {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	createdAt: Date;

	constructor({ ...partial }: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
