import { Roles } from "../constants/roles";

export type JwtPayload = {
	sub: string;
	email: string;
	roles: Roles[];
};
