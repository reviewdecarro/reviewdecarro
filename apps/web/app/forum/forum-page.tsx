"use client";

import Link from "next/link";
import { useState } from "react";
import { ForumThreadRow } from "@/components/ForumThreadRow";
import type { ForumTopicSummary } from "@/types";

type ForumPageProps = {
	data: {
		threads: ForumTopicSummary[];
	};
};

export function ForumPage({ data }: ForumPageProps) {
	const [tab, setTab] = useState<"recent" | "top">("recent");
	const [search, setSearch] = useState("");

	const filtered = [...data.threads]
		.filter(
			(thread) =>
				!search || thread.title.toLowerCase().includes(search.toLowerCase()),
		)
		.sort((a, b) =>
			tab === "top"
				? b.votes - a.votes
				: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

	return (
		<div className="max-w-[1100px] mx-auto px-6 py-10">
			<div className="grid gap-8">
				<section className="w-full">
					<div className="mb-7">
						<h1
							className="font-display font-extrabold text-[28px] mb-1.5"
							style={{ color: "var(--text)" }}
						>
							Fórum da Comunidade
						</h1>
						<p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
							Dúvidas, discussões e relatos da comunidade PapoAuto.
						</p>
					</div>

					<div className="flex gap-3 mb-5 items-center flex-wrap">
						<div
							className="flex gap-0 rounded-lg p-0.5 border"
							style={{
								background: "var(--surface-2)",
								borderColor: "var(--border)",
							}}
						>
							{[
								{ value: "recent", label: "Recentes" },
								{ value: "top", label: "Em alta" },
							].map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => setTab(option.value as "recent" | "top")}
									className="rounded-md px-4 py-1.5 text-[13px] font-medium cursor-pointer border-none transition-all duration-150"
									style={{
										background:
											tab === option.value ? "var(--surface)" : "transparent",
										color:
											tab === option.value
												? "var(--text)"
												: "var(--text-muted)",
										boxShadow:
											tab === option.value
												? "0 1px 4px rgba(0,0,0,0.08)"
												: "none",
									}}
								>
									{option.label}
								</button>
							))}
						</div>

						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Buscar tópicos..."
							className="flex-1 min-w-[220px] rounded-lg px-3.5 py-2 text-[13px] border outline-none"
							style={{
								background: "var(--surface)",
								borderColor: "var(--border)",
								color: "var(--text)",
							}}
						/>

						<Link
							href="/forum/new"
							className="px-4 py-2 rounded-lg border-none text-[13px] font-semibold text-white whitespace-nowrap"
							style={{ background: "var(--accent)" }}
						>
							+ Criar um tópico
						</Link>
					</div>

					<div
						className="rounded-xl overflow-hidden px-3 border"
						style={{
							background: "var(--palette-white)",
							borderColor: "var(--border)",
						}}
					>
						{filtered.map((thread) => (
							<ForumThreadRow key={thread.id} thread={thread} />
						))}

						{filtered.length === 0 ? (
							<div
								className="py-10 text-center text-[14px]"
								style={{ color: "var(--text-muted)" }}
							>
								Nenhum tópico encontrado.
							</div>
						) : null}
					</div>
				</section>
			</div>
		</div>
	);
}
