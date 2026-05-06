"use client";

import { LoaderCircle, MessageSquarePlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useAuthSession } from "@/hooks/use-auth-session";
import { API_BASE_URL } from "@/lib/api";

const MAX_MARKDOWN_LENGTH = 20_000;

export function NewThreadForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isCheckingSession } = useAuthSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isCheckingSession && !isLoggedIn) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [isCheckingSession, isLoggedIn, pathname, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Defina um título para o tópico.");
      return;
    }

    if (!content.trim()) {
      setError("Escreva o conteúdo do tópico.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/forum/topics`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        topic?: { slug: string };
      };

      if (!response.ok || !data.topic?.slug) {
        throw new Error(data.message ?? "Não foi possível criar o tópico.");
      }

      router.push(`/forum/${data.topic.slug}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar o tópico.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div
        className="rounded-2xl border px-6 py-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          Carregando sessão...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="rounded-2xl border px-6 py-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          Redirecionando para o login...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border px-6 py-8"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <MessageSquarePlus
          size={18}
          strokeWidth={2}
          style={{ color: "var(--accent)" }}
        />
        <h2
          className="font-display font-extrabold text-[20px]"
          style={{ color: "var(--text)" }}
        >
          Novo tópico
        </h2>
      </div>

      {error ? (
        <div
          className="rounded-xl px-4 py-3 mb-4 text-[13px] border"
          style={{
            background: "oklch(0.97 0.04 25)",
            borderColor: "oklch(0.88 0.08 25)",
            color: "oklch(0.45 0.17 25)",
          }}
        >
          {error}
        </div>
      ) : null}

      <label
        className="block text-[13px] font-medium mb-2"
        style={{ color: "var(--text-muted)" }}
        htmlFor="forum-title"
      >
        Título
      </label>
      <input
        id="forum-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ex.: Melhor SUV usado até 120 mil?"
        className="w-full rounded-lg px-3.5 py-2.5 text-[14px] border outline-none mb-5"
        style={{
          background: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      />

      <label
        className="block text-[13px] font-medium mb-2"
        style={{ color: "var(--text-muted)" }}
        htmlFor="forum-content"
      >
        Conteúdo
      </label>
      <MarkdownEditor
        value={content}
        onChange={(value) => setContent(value.slice(0, MAX_MARKDOWN_LENGTH))}
        placeholder="Descreva sua dúvida, contexto e critérios da decisão..."
        maxLength={MAX_MARKDOWN_LENGTH}
        height={420}
      />
      <p className="mt-2 text-[12px]" style={{ color: "var(--text-light)" }}>
        {content.length}/{MAX_MARKDOWN_LENGTH} caracteres
      </p>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
          style={{
            background: submitting ? "oklch(0.68 0.10 38)" : "var(--accent)",
          }}
        >
          {submitting ? (
            <>
              <LoaderCircle className="animate-spin" size={16} strokeWidth={2} />
              Publicando...
            </>
          ) : (
            "Publicar tópico"
          )}
        </button>
      </div>
    </form>
  );
}
