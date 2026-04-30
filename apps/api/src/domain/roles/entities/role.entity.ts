import { Expose } from "class-transformer";
import { RoleModel } from "../../../../prisma/generated/models/Role";

export class RoleEntity implements RoleModel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
