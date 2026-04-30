import { Expose } from "class-transformer";
import { RoleModel } from "../../../../prisma/generated/models/Role";
import { UserEntity } from "../../users/entities/user.entity";

export class RoleEntity implements RoleModel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  users?: UserEntity[] | null;

  constructor({ users, ...partial }: Partial<RoleEntity>) {
    Object.assign(this, partial);

    if (users) {
      this.users = users.map((user) => new UserEntity(user));
    }
  }
}
