import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";

export function toUserResponseDto(user: UserEntity): UserResponseDto {
	return plainToInstance(UserResponseDto, user, {
		excludeExtraneousValues: true,
	});
}
