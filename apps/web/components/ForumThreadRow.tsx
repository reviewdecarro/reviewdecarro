"use client";

import { MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "@/api/api";
import { useAuthSession } from "@/hooks/use-auth-session";
import type { ForumTopicSummary } from "@/types";
import { VoteButton } from "./VoteButton";

type ForumThreadRowProps = {
	thread: ForumTopicSummary;
};

export function ForumThreadRow({ thread }: ForumThreadRowProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { isLoggedIn } = useAuthSession();
	const [voted, setVoted] = useState(false);
	const [votes, setVotes] = useState(thread.votes);
	const [isVoting, setIsVoting] = useState(false);

	async function handleVote(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (!isLoggedIn) {
			const next = encodeURIComponent(pathname);
			router.push(`/login?next=${next}`);
			return;
		}

		if (isVoting) {
			return;
		}

		const nextVoted = !voted;
		const nextVotes = votes + (nextVoted ? 1 : -1);

		setIsVoting(true);
		setVotes(nextVotes);
		setVoted(nextVoted);

		try {
			const response = await fetch(
				`${API_BASE_URL}/forum/topics/${thread.id}/vote`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ value: "UP" }),
				},
			);

			if (!response.ok) {
				throw new Error();
			}
		} catch {
			setVotes(votes);
			setVoted(voted);
		} finally {
			setIsVoting(false);
		}
	}

	return (
		<div className="flex items-center gap-3.5 rounded-lg border-b border-border bg-palette-white px-3.5 py-3.5 transition-colors duration-100 hover:bg-surface-2">
			<div className="shrink-0">
				<VoteButton count={votes} voted={voted} onVote={handleVote} />
			</div>

			<Link
				href={`/forum/${thread.slug}`}
				className="flex min-w-0 flex-1 items-center gap-3.5"
			>
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-pretty text-[14px] font-medium leading-snug text-text">
						{thread.title}
					</div>
					<div className="flex flex-wrap items-center gap-2 text-[12px] text-text-muted">
						<span>·</span>
						<span className="font-medium text-accent">{thread.author}</span>
						<span>·</span>
						<span>{thread.date}</span>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-1.5 text-[13px] text-text-muted">
					<MessageSquareMore size={14} strokeWidth={1.8} />
					{thread.comments}
				</div>
			</Link>
		</div>
	);
}
