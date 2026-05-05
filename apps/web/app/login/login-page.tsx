"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";
import { LoginForm } from "./login-form";

export function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isCheckingSession } = useAuthSession();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  if (isCheckingSession || isLoggedIn) {
    return (
      <div className="w-full max-w-[420px] rounded-2xl border px-5 py-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <LoaderCircle className="animate-spin" size={22} strokeWidth={2} />
        </div>
        <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
          Redirecionando...
        </p>
      </div>
    );
  }

  return <LoginForm />;
}
