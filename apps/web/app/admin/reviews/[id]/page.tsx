import type { Metadata } from "next";
import { AdminReviewDetailPage } from "../../admin-pages";

export const metadata: Metadata = {
	title: "Admin avaliação | PapoAuto",
};

type AdminReviewDetailRouteProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminReviewDetailRoute({
	params,
}: AdminReviewDetailRouteProps) {
	const { id } = await params;

	return <AdminReviewDetailPage id={id} />;
}
