"use client";

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
			className="flex min-w-[3.25rem] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[13px] font-semibold transition-colors duration-150"
			style={{
				background: voted ? "var(--accent-light)" : "var(--surface)",
				borderColor: voted ? "var(--accent)" : "var(--border)",
				color: voted ? "var(--accent)" : "var(--text-muted)",
			}}
		>
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<path
					d="M7 2L11.5 8H2.5L7 2Z"
					fill="currentColor"
					opacity="0.9"
				/>
			</svg>
			{count}
		</button>
	);
}
