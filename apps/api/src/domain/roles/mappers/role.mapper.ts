import { plainToInstance } from "class-transformer";
import { RoleResponseDto } from "../dtos/role.dto";
import { RoleEntity } from "../entities/role.entity";

export class RolesMapper {
  static toRoleResponseDto(role: RoleEntity): RoleResponseDto {
    return plainToInstance(RoleResponseDto, role, {
      excludeExtraneousValues: true,
    });
  }
}
