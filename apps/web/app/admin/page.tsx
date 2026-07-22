import type { Metadata } from "next";
import { AdminSummaryPage } from "./admin-pages";

export const metadata: Metadata = {
	title: "Admin | PapoAuto",
};

export default function AdminPage() {
	return <AdminSummaryPage />;
}
