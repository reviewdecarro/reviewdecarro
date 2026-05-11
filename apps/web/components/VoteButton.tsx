"use client";

import { ArrowUp } from "lucide-react";

type VoteButtonProps = {
	count: number;
	voted: boolean;
	onVote: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function VoteButton({ count, voted, onVote }: VoteButtonProps) {
	return (
		<button
			type="button"
			onClick={onVote}
			className="flex min-w-[3.25rem] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[13px] font-semibold transition duration-150 cursor-pointer hover:brightness-95 duration-300"
			style={{
				background: voted ? "var(--accent-light)" : "var(--surface)",
				borderColor: voted ? "var(--accent)" : "var(--border)",
				color: voted ? "var(--accent)" : "var(--text-muted)",
			}}
		>
			<ArrowUp size={14} strokeWidth={2.2} />
			{count}
		</button>
	);
}
