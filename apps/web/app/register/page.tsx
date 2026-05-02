import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
	title: "Cadastro | PapoAuto",
};

export default function RegisterPage() {
	return (
		<>
			<Nav />
			<main
				className="min-h-[calc(100vh-56px)] flex items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-14"
				style={{ background: "var(--bg)" }}
			>
				<RegisterForm />
			</main>
		</>
	);
}
