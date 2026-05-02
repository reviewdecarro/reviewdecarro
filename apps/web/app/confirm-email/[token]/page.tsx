import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ConfirmEmailClient } from "../confirm-email-client";

export const metadata: Metadata = {
	title: "Confirmar e-mail | PapoAuto",
};

type ConfirmEmailTokenPageProps = {
	params: Promise<{
		token: string;
	}>;
};

export default async function ConfirmEmailTokenPage({
	params,
}: ConfirmEmailTokenPageProps) {
	const { token } = await params;

	return (
		<>
			<Nav />
			<main
				className="min-h-[calc(100vh-56px)] flex items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-14"
				style={{ background: "var(--bg)" }}
			>
				<ConfirmEmailClient token={token} />
			</main>
		</>
	);
}
