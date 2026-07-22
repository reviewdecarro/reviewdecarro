import type { CreateUserDto } from "../dtos/create-user.dto";
import type { UserEntity } from "../entities/user.entity";

export type AdminUsersListParams = {
	query?: string;
	page: number;
	limit: number;
};

export type AdminUsersListResult = {
	users: UserEntity[];
	total: number;
};

export abstract class UsersRepositoryProps {
	abstract create(user: CreateUserDto): Promise<UserEntity>;
	abstract findById(id: string): Promise<UserEntity | null>;
	abstract findByEmail(email: string): Promise<UserEntity | null>;
	abstract findByUsername(username: string): Promise<UserEntity | null>;
	abstract countActive(): Promise<number>;
	abstract findManyForAdmin(
		params: AdminUsersListParams,
	): Promise<AdminUsersListResult>;
	abstract confirmEmail(id: string): Promise<void>;
	abstract updatePassword(id: string, passwordHash: string): Promise<void>;
	abstract delete(id: string): Promise<void>;
}
