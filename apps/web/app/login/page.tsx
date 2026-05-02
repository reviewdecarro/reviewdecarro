import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
	title: "Entrar | PapoAuto",
};

export default function LoginPage() {
	return (
		<>
			<Nav />
			<main
				className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-14"
				style={{ background: "var(--bg)" }}
			>
				<LoginForm />
			</main>
		</>
	);
}
