import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./types/jwt-payload";

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async generateToken(payload: JwtPayload) {
		return {
			accessToken: await this.jwtService.signAsync(payload),
		};
	}
}
