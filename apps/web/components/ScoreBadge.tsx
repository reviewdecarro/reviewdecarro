type ScoreSize = "sm" | "md" | "lg";

type ScoreBadgeProps = {
	score: number;
	size?: ScoreSize;
};

function getScoreColor(score: number): string {
	if (score >= 9.0) return "oklch(0.57 0.17 148)";
	if (score >= 8.0) return "oklch(0.60 0.15 165)";
	if (score >= 7.0) return "oklch(0.65 0.16 78)";
	return "oklch(0.60 0.17 28)";
}

const sizeClasses: Record<ScoreSize, string> = {
	sm: "text-[13px] px-2 py-0.5 rounded-md",
	md: "text-[16px] px-2.5 py-1 rounded-lg",
	lg: "text-[26px] px-4 py-2 rounded-xl",
};

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
	const color = getScoreColor(score);
	const sizeClass = sizeClasses[size];

	return (
		<div
			className={`inline-flex items-baseline gap-px flex-shrink-0 ${sizeClass}`}
			style={{ background: color.replace(")", " / 0.1)") }}
		>
			<span className="font-display font-bold leading-none" style={{ color }}>
				{score.toFixed(1)}
			</span>
			<span style={{ color, fontSize: "55%", opacity: 0.7, lineHeight: 1 }}>
				/10
			</span>
		</div>
	);
}
