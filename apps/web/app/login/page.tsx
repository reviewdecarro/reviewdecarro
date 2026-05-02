import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { LoginPage as LoginPageShell } from "./login-page";

export const metadata: Metadata = {
	title: "Entrar | PapoAuto",
};

export default function LoginRoute() {
	return (
		<>
			<Nav />
			<main
				className="min-h-[calc(100vh-56px)] flex items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-14"
				style={{ background: "var(--bg)" }}
			>
				<LoginPageShell />
			</main>
		</>
	);
}
