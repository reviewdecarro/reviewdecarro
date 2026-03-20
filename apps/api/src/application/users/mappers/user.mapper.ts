import type { UserEntity } from '../entities/user.entity';

export function toUserDto({ id, username, email, createdAt }: UserEntity) {
	return {
		id,
		username,
		email,
		createdAt,
	};
}
