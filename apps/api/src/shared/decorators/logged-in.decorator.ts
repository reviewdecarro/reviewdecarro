import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { UserEntity } from "src/domain/users/entities/user.entity";

export const LoggedInUser = createParamDecorator(
	(_: unknown, context: ExecutionContext): UserEntity => {
		const request = context.switchToHttp().getRequest();

		return request.user;
	},
);
