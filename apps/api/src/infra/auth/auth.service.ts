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

	async verifyToken(token: string): Promise<JwtPayload | null> {
		try {
			return await this.jwtService.verifyAsync<JwtPayload>(token);
		} catch {
			return null;
		}
	}
}
