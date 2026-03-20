import type { CreateUserDto } from '../dtos/create-user.dto';
import type { UserEntity } from '../entities/user.entity';

export abstract class UsersRepositoryProps {
	abstract create(user: CreateUserDto): Promise<UserEntity>;
	abstract findById(id: string): Promise<UserEntity | null>;
	abstract findByEmail(email: string): Promise<UserEntity | null>;
	abstract findByUsername(username: string): Promise<UserEntity | null>;
}
