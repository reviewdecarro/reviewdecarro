import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "../../../../prisma/generated/enums";
import { UserEntity } from "../../../domain/users/entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user: UserEntity = request.user;

		if (!user?.roles) {
			return false;
		}

		return user.roles.some((role) => requiredRoles.includes(role.type));
	}
}
