type TagBadgeProps = {
	label: string;
};

export function TagBadge({ label }: TagBadgeProps) {
	return (
		<span
			className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
			style={{
				background: "var(--accent-light)",
				color: "var(--accent)",
			}}
		>
			{label}
		</span>
	);
}
