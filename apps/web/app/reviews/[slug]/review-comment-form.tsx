"use client";

import { LoaderCircle, MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useAuthSession } from "@/hooks/use-auth-session";
import { API_BASE_URL } from "@/lib/api";

type ReviewCommentFormProps = {
	reviewId: string;
};

const MAX_MARKDOWN_LENGTH = 20_000;

export function ReviewCommentForm({ reviewId }: ReviewCommentFormProps) {
	const router = useRouter();
	const { isLoggedIn, isCheckingSession } = useAuthSession();
	const [content, setContent] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!content.trim()) {
			setError("Escreva um comentário antes de publicar.");
			return;
		}

		setError("");
		setSubmitting(true);

		try {
			const response = await fetch(
				`${API_BASE_URL}/reviews/${reviewId}/comments`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ content }),
				},
			);

			const data = (await response.json()) as { message?: string };

			if (!response.ok) {
				throw new Error(
					data.message ?? "Não foi possível publicar o comentário.",
				);
			}

			setContent("");
			router.refresh();
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Não foi possível publicar o comentário.",
			);
		} finally {
			setSubmitting(false);
		}
	}

	if (isCheckingSession) {
		return (
			<div
				className="rounded-xl border px-5 py-6"
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
				className="rounded-xl border px-5 py-6"
				style={{
					background: "var(--surface)",
					borderColor: "var(--border)",
				}}
			>
				<p className="text-[14px] mb-4" style={{ color: "var(--text-muted)" }}>
					Entre na sua conta para comentar.
				</p>
				<a
					href="/login"
					className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white"
					style={{ background: "var(--accent)" }}
				>
					<MessageSquarePlus size={16} strokeWidth={2} />
					Fazer login
				</a>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-xl border px-5 py-6"
			style={{
				background: "var(--surface)",
				borderColor: "var(--border)",
			}}
		>
			<div className="flex items-center gap-2 mb-4">
				<MessageSquarePlus
					size={18}
					strokeWidth={2}
					style={{ color: "var(--accent)" }}
				/>
				<h3
					className="font-display font-bold text-lg"
					style={{ color: "var(--text)" }}
				>
					Deixe seu comentário
				</h3>
			</div>

			{error && (
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
			)}

			<label
				className="block text-[13px] font-medium mb-2"
				style={{ color: "var(--text-muted)" }}
				htmlFor="content"
			>
				Seu comentário
			</label>
			<MarkdownEditor
				value={content}
				onChange={(value) => setContent(value.slice(0, MAX_MARKDOWN_LENGTH))}
				placeholder="Escreva seu comentário"
				maxLength={MAX_MARKDOWN_LENGTH}
			/>
			<p className="mt-2 text-[12px]" style={{ color: "var(--text-light)" }}>
				{content.length}/{MAX_MARKDOWN_LENGTH} caracteres
			</p>

			<div className="mt-4 flex justify-end">
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
							<LoaderCircle
								className="animate-spin"
								size={16}
								strokeWidth={2}
							/>
							Publicando...
						</>
					) : (
						"Publicar comentário"
					)}
				</button>
			</div>
		</form>
	);
}
