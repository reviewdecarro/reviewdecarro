import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmEmailDto {
	@ApiProperty({ example: "uuid-confirmation-token" })
	@IsString()
	@IsNotEmpty()
	readonly token: string;
}
