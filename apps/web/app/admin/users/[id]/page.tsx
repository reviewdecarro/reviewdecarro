import type { Metadata } from "next";
import { AdminUserDetailPage } from "../../admin-pages";

export const metadata: Metadata = {
	title: "Admin usuário | PapoAuto",
};

type AdminUserDetailRouteProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminUserDetailRoute({
	params,
}: AdminUserDetailRouteProps) {
	const { id } = await params;

	return <AdminUserDetailPage id={id} />;
}
