import type { Metadata } from "next";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
	title: "Admin | PapoAuto",
};

export default function AdminPage() {
	return (
		<main className="flex-1" style={{ background: "var(--surface)" }}>
			<div className="container mx-auto px-6 py-10 sm:py-12">
				<AdminClient />
			</div>
		</main>
	);
}
