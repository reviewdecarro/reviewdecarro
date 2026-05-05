import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Redefinir senha | PapoAuto",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Nav />
      <main
        className="min-h-[calc(100vh-56px)] flex items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-14"
        style={{ background: "var(--bg)" }}
      >
        <ForgotPasswordForm />
      </main>
    </>
  );
}
