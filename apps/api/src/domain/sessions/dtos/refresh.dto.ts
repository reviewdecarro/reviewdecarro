import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class RefreshDto {
	@ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
	@IsUUID()
	readonly sessionId: string;

	@ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001" })
	@IsString()
	readonly refreshToken: string;
}
