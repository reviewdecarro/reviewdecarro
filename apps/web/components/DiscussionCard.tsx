import { Clock, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { ForumTopicSummary } from "@/types";

type DiscussionCardProps = {
	thread: ForumTopicSummary;
};

export function DiscussionCard({ thread }: DiscussionCardProps) {
	const voteCount = thread.upvotes ?? thread.votes ?? 0;

	return (
		<Link
			href={`/forum/${thread.slug}`}
			className="group block rounded-xl p-6 bg-white transition-all duration-200 hover:shadow-lg"
			style={{
				borderTop: "1px solid var(--border)",
				borderRight: "1px solid var(--border)",
				borderBottom: "1px solid var(--border)",
				borderLeft: "4px solid var(--accent)",
			}}
		>
			{/* Linha de topo: ícone trending + badge de categoria */}
			<div className="flex items-center gap-2 mb-2">
				<TrendingUp size={14} strokeWidth={1.8} className="text-[var(--text-muted)]" />
				{thread.category && (
					<span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]">
						{thread.category}
					</span>
				)}
			</div>

			{/* Número de votos */}
			<div className="text-2xl font-extrabold mb-1 text-[var(--text)]">
				{voteCount}
			</div>

			{/* Título */}
			<p className="font-bold text-sm leading-snug line-clamp-2 mb-3 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
				{thread.title}
			</p>

			{/* Rodapé: author · clock · date · comments */}
			<div className="flex items-center gap-1.5 text-xs flex-wrap text-[var(--text-muted)]">
				<span className="text-gray-700 font-semibold">{thread.author}</span>
				<span>·</span>
				<Clock size={12} strokeWidth={1.8} />
				<span>{thread.date}</span>
				<span>·</span>
				<MessageSquare size={12} strokeWidth={1.8} />
				<span>{thread.comments}</span>
			</div>
		</Link>
	);
}
