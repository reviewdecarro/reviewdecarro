import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
	title: "Register | PapoAuto",
};

export default function RegisterPage() {
	return (
		<main
			className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-14"
			style={{ background: "var(--bg)" }}
		>
			<RegisterForm />
		</main>
	);
}
