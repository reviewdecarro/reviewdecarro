import type { Metadata } from "next";
import { AdminUsersPage } from "../admin-pages";

export const metadata: Metadata = {
	title: "Admin usuários | PapoAuto",
};

type AdminUsersRouteProps = {
	searchParams: Promise<{
		q?: string | string[];
		page?: string | string[];
		limit?: string | string[];
	}>;
};

export default async function AdminUsersRoute({
	searchParams,
}: AdminUsersRouteProps) {
	const params = await searchParams;

	return (
		<AdminUsersPage
			initialQuery={readString(params.q)}
			initialPage={readPositiveInt(params.page, 1)}
			initialLimit={readPositiveInt(params.limit, 20)}
		/>
	);
}

function readString(value?: string | string[]) {
	return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function readPositiveInt(value: string | string[] | undefined, fallback: number) {
	const numberValue = Number(Array.isArray(value) ? value[0] : value);
	return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : fallback;
}
