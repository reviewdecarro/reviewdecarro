"use client";

import { MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Thread } from "@/types";
import { VoteButton } from "./VoteButton";

type ForumThreadRowProps = {
	thread: Thread;
};

const catColors: Record<string, string> = {
	"Dicas de compra": "oklch(0.60 0.16 250)",
	Discussão: "oklch(0.55 0.16 170)",
	História: "oklch(0.57 0.17 148)",
};

export function ForumThreadRow({ thread }: ForumThreadRowProps) {
	const [voted, setVoted] = useState(false);
	const [votes, setVotes] = useState(thread.votes);

	function handleVote(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		setVotes((v) => (voted ? v - 1 : v + 1));
		setVoted((v) => !v);
	}

	const catColor = catColors[thread.category] ?? "var(--text-muted)";

	return (
		<Link
			href={`/forum/${thread.id}`}
			className="flex items-center gap-3.5 py-3.5 border-b rounded-lg px-2.5 transition-colors duration-100"
			style={{ borderColor: "var(--border)" }}
			onMouseEnter={(e) =>
				(e.currentTarget.style.background = "var(--surface-2)")
			}
			onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
		>
			<div className="flex-shrink-0">
				<VoteButton count={votes} voted={voted} onVote={handleVote} />
			</div>

			<div className="flex-1 min-w-0">
				<div
					className="text-[14px] font-medium leading-snug mb-1"
					style={
						{ color: "var(--text)", textWrap: "pretty" } as React.CSSProperties
					}
				>
					{thread.title}
				</div>
				<div
					className="text-[12px] flex flex-wrap items-center gap-2"
					style={{ color: "var(--text-light)" }}
				>
					{/* <span className="font-medium" style={{ color: catColor }}>{thread.category}</span> */}
					<span>·</span>
					<span className="font-medium" style={{ color: "var(--accent)" }}>
						{thread.author}
					</span>
					<span>·</span>
					<span>{thread.date}</span>
					<span>·</span>
					<span>{thread.views} visualizações</span>
				</div>
			</div>

			<div
				className="flex-shrink-0 flex items-center gap-1.5 text-[13px]"
				style={{ color: "var(--text-muted)" }}
			>
				<MessageSquareMore size={14} strokeWidth={1.8} />
				{thread.comments}
			</div>
		</Link>
	);
}
