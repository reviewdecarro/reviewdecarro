import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../../../../prisma/generated/enums";

export const ROLES_KEY = Symbol("roles");

export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
