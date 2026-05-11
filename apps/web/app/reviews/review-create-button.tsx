"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/use-auth-session";

export function ReviewCreateButton() {
  const router = useRouter();
  const { isLoggedIn } = useAuthSession();

  function handleClick() {
    if (isLoggedIn) {
      router.push("/reviews/new");
      return;
    }

    const next = encodeURIComponent("/reviews/new");
    router.push(`/login?next=${next}`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
      style={{ background: "var(--accent)" }}
      aria-label={
        isLoggedIn ? "Criar nova avaliação" : "Fazer login para criar avaliação"
      }
    >
      <Plus size={16} strokeWidth={2} />
      Nova avaliação
    </button>
  );
}
