import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/application/users/dtos/create-user.dto";

export class RegisterUserResponse {
	@ApiProperty({
		example:
			"Usuário cadastrado com sucesso. Um e-mail de confirmação foi enviado.",
	})
	message: string;

	@ApiProperty({ type: UserResponseDto })
	user: UserResponseDto;
}

export class LoginUserResponse {
	@ApiProperty({ example: "Login realizado com sucesso." })
	message: string;

	@ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
	access_token: string;
}

export class ShowProfileResponse {
	@ApiProperty({ example: "Perfil encontrado com sucesso." })
	message: string;

	@ApiProperty({ type: UserResponseDto })
	user: UserResponseDto;
}
