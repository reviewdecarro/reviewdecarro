import { UserEntity } from '../entities/user.entity';

export interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
}

export abstract class UsersRepository {
  abstract create(data: CreateUserInput): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
}
