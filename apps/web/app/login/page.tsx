import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
	title: "Login | PapoAuto",
};

export default function LoginPage() {
	return (
		<main
			className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-14"
			style={{ background: "var(--bg)" }}
		>
			<LoginForm />
		</main>
	);
}
