import type { Metadata } from "next";
import { AdminForumDetailPage } from "../../admin-pages";

export const metadata: Metadata = {
	title: "Admin tópico | PapoAuto",
};

type AdminForumDetailRouteProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminForumDetailRoute({
	params,
}: AdminForumDetailRouteProps) {
	const { id } = await params;

	return <AdminForumDetailPage id={id} />;
}
