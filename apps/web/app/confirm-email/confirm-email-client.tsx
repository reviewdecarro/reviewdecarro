"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ConfirmEmailResponse = {
  message?: string;
};

type ConfirmEmailClientProps = {
  token: string;
};

export function ConfirmEmailClient({ token }: ConfirmEmailClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function confirmEmail() {
      if (!token) {
        if (active) {
          setError("O token de confirmação não foi informado.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}/users/confirm-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          },
        );

        const data = (await response.json()) as ConfirmEmailResponse;

        if (!response.ok) {
          throw new Error(
            data.message ?? "Não foi possível confirmar o e-mail.",
          );
        }

        if (active) {
          setSuccessMessage(data.message ?? "E-mail confirmado com sucesso.");
          setError("");
        }
      } catch (submitError) {
        if (active) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "Não foi possível confirmar o e-mail.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    confirmEmail();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <h1
          className="font-display font-extrabold text-[30px] mb-2"
          style={{ color: "var(--text)" }}
        >
          Confirmar e-mail
        </h1>
        <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
          Estamos validando o seu link de confirmação.
        </p>
      </div>

      {loading ? (
        <div
          className="rounded-2xl border px-5 py-6 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-center mb-4">
            <LoaderCircle className="animate-spin" size={22} strokeWidth={2} />
          </div>
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            Confirmando seu e-mail...
          </p>
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border px-5 py-6"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-[20px] font-display font-extrabold leading-tight mb-3"
            style={{ color: "var(--text)" }}
          >
            Não foi possível confirmar o e-mail.
          </p>
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            {error}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              Ir para o login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Voltar para o início
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl border px-5 py-6"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-[20px] font-display font-extrabold leading-tight mb-3"
            style={{ color: "var(--text)" }}
          >
            E-mail confirmado com sucesso.
          </p>
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            {successMessage || "Sua conta já está pronta para uso."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              Ir para o login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Voltar para o início
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
