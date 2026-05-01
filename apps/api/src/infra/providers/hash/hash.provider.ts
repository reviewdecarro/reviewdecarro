import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { HashProviderProps } from "./types/hash-provider.props";

@Injectable()
export class HashProvider implements HashProviderProps {
	async hash(password: string): Promise<string> {
		return await hash(password, 10);
	}

	async compare(password: string, password_compared: string): Promise<boolean> {
		return await compare(password, password_compared);
	}
}
